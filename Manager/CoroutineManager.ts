/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

import {BaseManager} from "./BaseManager";
import {ManagerRoot} from "../Root/ManagerRoot";

@jsClass("WaitForFrames")
export class WaitForFrames {
	private readonly _frames: number;
	private _doneFrame: number;

	constructor(frames: number) {
		this._frames = frames;
	}

	public resetDoneFrame(): void {
		this._doneFrame = cc.director.getTotalFrames() + this._frames;
	}

	public get isDone(): boolean {
		return cc.director.getTotalFrames() >= this._doneFrame;
	}
}

@jsClass("WaitForSeconds")
export class WaitForSeconds {
	private readonly _milliSeconds: number;
	private _doneTime: number;

	constructor(seconds: number) {
		this._milliSeconds = seconds * 1000;
	}

	public resetDoneTime(): void {
		this._doneTime = Date.now() + this._milliSeconds;
	}

	public get isDone(): boolean {
		return Date.now() >= this._doneTime;
	}
}

@jsClass("WaitForLateUpdate")
export class WaitForLateUpdate { }

@jsClass("Coroutine")
export class Coroutine {
	private readonly _owner: cc.Component;
	public get owner(): cc.Component {
		return this._owner;
	}

	private readonly _iterator: IterableIterator<any>;
	public get iterator(): IterableIterator<any> {
		return this._iterator;
	}

	private _current: any;
	public get current(): any {
		return this._current;
	}

	constructor(iterator: IterableIterator<any>, mOwner?: cc.Component) {
		this._iterator = iterator;
		this._owner = mOwner;
	}

	public next(): IteratorResult<any> {
		let result;
		try {
			result = this._iterator.next();
		} catch (e) {
			result = {done: true};
			console.error(e);
		}
		this._current = result.value;
		return result;
	}
}

@jsClass
export class CoroutineManager extends BaseManager {
	public static get instance(): CoroutineManager {
		return ManagerRoot.instance.get(this);
	}

	//#region Coroutine
	private _coroutinesMap = new Map<Function, Coroutine[]>();

	protected onLoad() {
		this._coroutinesMap.set(Object, []);
		this._coroutinesMap.set(WaitForFrames, []);
		this._coroutinesMap.set(WaitForSeconds, []);
		this._coroutinesMap.set(Coroutine, []);
		this._coroutinesMap.set(WaitForLateUpdate, []);
	}

	protected update(): void {
		this.invokeDefaultCoroutine();
		this.invokeFramesCoroutine();
		this.invokeSecondsCoroutine();
		this.invokeStartCoroutineCoroutine();
	}

	protected lateUpdate(): void {
		this.invokeLateUpdateCoroutine();
	}

	private invokeDefaultCoroutine(): void {
		let coroutines = this._coroutinesMap.get(Object);
		this._coroutinesMap.set(Object, []);
		for (let coroutine of coroutines) {
			if (coroutine) {
				if (!coroutine.owner || coroutine.owner.isValid) {
					if (!coroutine.next().done) {
						this.updateCoroutine(coroutine);
						this.addCoroutine(coroutine);
					}
				}
			}
		}
	}

	private invokeFramesCoroutine(): void {
		let coroutines = this._coroutinesMap.get(WaitForFrames);
		this._coroutinesMap.set(WaitForFrames, []);
		for (let coroutine of coroutines) {
			if (coroutine) {
				if (!coroutine.owner || coroutine.owner.isValid) {
					let current: WaitForFrames = coroutine.current;
					if (current.isDone) {
						if (!coroutine.next().done) {
							this.updateCoroutine(coroutine);
							this.addCoroutine(coroutine);
						}
					} else {
						this.addCoroutine(coroutine);
					}
				}
			}
		}
	}

	private invokeSecondsCoroutine(): void {
		let coroutines = this._coroutinesMap.get(WaitForSeconds);
		this._coroutinesMap.set(WaitForSeconds, []);
		for (let coroutine of coroutines) {
			if (coroutine) {
				if (!coroutine.owner || coroutine.owner.isValid) {
					let current: WaitForSeconds = coroutine.current;
					if (current.isDone) {
						if (!coroutine.next().done) {
							this.updateCoroutine(coroutine);
							this.addCoroutine(coroutine);
						}
					} else {
						this.addCoroutine(coroutine);
					}
				}
			}
		}
	}

	private invokeStartCoroutineCoroutine(): void {
		let coroutines = this._coroutinesMap.get(Coroutine);
		this._coroutinesMap.set(Coroutine, []);
		for (let coroutine of coroutines) {
			if (coroutine) {
				if (!coroutine.owner || coroutine.owner.isValid) {
					let current: Coroutine = coroutine.current;
					if (this.isCoroutineDone(current)) {
						if (!coroutine.next().done) {
							this.updateCoroutine(coroutine);
							this.addCoroutine(coroutine);
						}
					} else {
						this.addCoroutine(coroutine);
					}
				}
			}
		}
	}

	private invokeLateUpdateCoroutine(): void {
		let coroutines = this._coroutinesMap.get(WaitForLateUpdate);
		this._coroutinesMap.set(WaitForLateUpdate, []);
		for (let coroutine of coroutines) {
			if (coroutine) {
				if (!coroutine.owner || coroutine.owner.isValid) {
					if (!coroutine.next().done) {
						this.updateCoroutine(coroutine);
						this.addCoroutine(coroutine);
					}
				}
			}
		}
	}

	private updateCoroutine(coroutine: Coroutine): void {
		let current = coroutine.current;
		if (current) {
			if ((<Object>current).constructor === WaitForFrames) {
				(<WaitForFrames>current).resetDoneFrame();
			} else if ((<Object>current).constructor === WaitForSeconds) {
				(<WaitForSeconds>current).resetDoneTime();
			}
		}
	}

	private addCoroutine(coroutine: Coroutine): void {
		let current = coroutine.current;
		if (current) {
			let type = (<Object>current).constructor;
			if (type && this._coroutinesMap.has(type)) {
				this._coroutinesMap.get(type).push(coroutine);
				return;
			}
		}
		this._coroutinesMap.get(Object).push(coroutine);
	}

	private isCoroutineDone(coroutine: Coroutine): boolean {
		for (let coroutines of this._coroutinesMap.values()) {
			for (let index = coroutines.length - 1; index >= 0; --index) {
				if (coroutines[index] === coroutine) {
					return false;
				}
			}
		}
		return true;
	}

	private getCoroutine(iterator: IterableIterator<any>): Coroutine {
		for (let coroutines of this._coroutinesMap.values()) {
			for (let index = coroutines.length - 1; index >= 0; --index) {
				let coroutine = coroutines[index];
				if (coroutine.iterator === iterator) {
					return coroutine;
				}
			}
		}
		return null;
	}

	private removeCoroutineBy(predicate: (type: Function, coroutine: Coroutine) => boolean): void {
		for (let [type, coroutines] of this._coroutinesMap) {
			for (let index = coroutines.length - 1; index >= 0; --index) {
				if (predicate(type, coroutines[index])) {
					coroutines.splice(index, 1);
				}
			}
		}
	}
	//#endregion

	public startCo(coroutine: Coroutine): Coroutine;
	public startCo(iterator: IterableIterator<any>, owner?: cc.Component): Coroutine;
	/**
	 * 开启一个类Unity协程
	 * @param iteratorOrCoroutine - 如果是新的迭代器对象(或协程)，则开启协程；如果是已开启并停止的迭代器对象(或协程)，则重新开启并继续
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public startCo(iteratorOrCoroutine: IterableIterator<any> | Coroutine, owner?: cc.Component): Coroutine {
		if (this.isRunning(iteratorOrCoroutine)) {
			throw new Error("Coroutine is already running!");
		}

		let coroutine: Coroutine;
		if (iteratorOrCoroutine instanceof Coroutine) {
			coroutine = iteratorOrCoroutine;
		} else {
			coroutine = new Coroutine(iteratorOrCoroutine, owner);
		}
		if (!coroutine.next().done) {
			this.updateCoroutine(coroutine);
			this.addCoroutine(coroutine);
		}
		return coroutine;
	}

	/**
	 * 结束某个协程
	 * @param iteratorOrCoroutine - 需要结束的迭代器对象(或协程)
	 */
	public stopCo(iteratorOrCoroutine: IterableIterator<any> | Coroutine): void {
		if (iteratorOrCoroutine instanceof Coroutine) {
			this.removeCoroutineBy((_, coroutine) => coroutine === iteratorOrCoroutine);
		} else {
			this.removeCoroutineBy((_, coroutine) => coroutine.iterator === iteratorOrCoroutine);
		}
	}

	/**
	 * 批量结束协程
	 * @param owner - 协程的拥有者，在创建协程时绑定对应关系
	 */
	public stopAllCo(owner: cc.Component): void {
		this.removeCoroutineBy((_, coroutine) => coroutine.owner === owner);
	}

	/**
	 * 无论协程当前等待的是什么，都跳至下一个yield
	 * @param iteratorOrCoroutine - 需要跳至下一个yield的迭代器对象(或协程)
	 */
	public moveNext(iteratorOrCoroutine: IterableIterator<any> | Coroutine): void {
		if (iteratorOrCoroutine instanceof Coroutine) {
			let isRunning = !this.isCoroutineDone(iteratorOrCoroutine);
			if (isRunning) {
				this.stopCo(iteratorOrCoroutine);
				this.startCo(iteratorOrCoroutine);
			} else {
				this.startCo(iteratorOrCoroutine);
				this.stopCo(iteratorOrCoroutine);
			}
		} else {
			let coroutine = this.getCoroutine(iteratorOrCoroutine);
			if (coroutine) {
				this.stopCo(coroutine);
				this.startCo(coroutine);
			} else {
				this.startCo(iteratorOrCoroutine);
				this.stopCo(iteratorOrCoroutine);
			}
		}
	}

	/**
	 * 直接将协程执行到最终状态
	 * @param iteratorOrCoroutine - 需要执行到最终状态的迭代器对象(或协程)
	 * @param maxSteps - 由于协程可能是个死循环，所以用一个最大步数来限制执行步数
	 */
	public flush(iteratorOrCoroutine: IterableIterator<any> | Coroutine, maxSteps: number = Number.MAX_VALUE): void {
		if (iteratorOrCoroutine) {
			this.stopCo(iteratorOrCoroutine);
			let hasNext = true;
			let steps = 0;
			while (hasNext && steps < maxSteps) {
				hasNext = !iteratorOrCoroutine.next().done;
				++steps;
			}
			if (steps >= maxSteps) {
				console.warn("Flush " + steps + " steps!");
			}
		}
	}

	/**
	 * 判断协程是否正在运行
	 * @param iteratorOrCoroutine - 需要判断状态的迭代器对象(或协程)
	 * @return 协程是否正在运行
	 */
	public isRunning(iteratorOrCoroutine: IterableIterator<any> | Coroutine): boolean {
		if (iteratorOrCoroutine instanceof Coroutine) {
			return !this.isCoroutineDone(iteratorOrCoroutine);
		} else {
			return !!this.getCoroutine(iteratorOrCoroutine);
		}
	}

	/**
	 * 在下一个LateUpdate执行回调
	 * @param callback - 需要执行的回调
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public late(callback: () => void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doLate(callback, owner), owner);
	}
	private * doLate(callback: () => void, owner: cc.Component): IterableIterator<any> {
		if (callback) {
			yield new WaitForLateUpdate();
			callback.call(owner);
		}
	}

	/**
	 * 等待一段时间执行回调
	 * @param delay - 等待的时间（秒）
	 * @param callback - 需要执行的回调
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public once(delay: number, callback: () => void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doOnce(delay == null ? null : new WaitForSeconds(delay), callback, false, owner), owner);
	}
	/**
	 * 先等到下一个LateUpdate，再等待一段时间执行回调
	 * @param delay - 等待的时间（秒）
	 * @param callback - 需要执行的回调
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public lateOnce(delay: number, callback: () => void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doOnce(delay == null ? null : new WaitForSeconds(delay), callback, true, owner), owner);
	}
	/**
	 * 等待一定帧数执行回调
	 * @param delay - 等待的帧数
	 * @param callback - 需要执行的回调
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public frameOnce(delay: number, callback: () => void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doOnce(delay == null ? null : new WaitForFrames(delay), callback, false, owner), owner);
	}
	/**
	 * 先等到下一个LateUpdate，再等待一定帧数执行回调
	 * @param delay - 等待的帧数
	 * @param callback - 需要执行的回调
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public lateFrameOnce(delay: number, callback: () => void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doOnce(delay == null ? null : new WaitForFrames(delay), callback, true, owner), owner);
	}
	private * doOnce(delay: WaitForFrames | WaitForSeconds, callback: () => void, late: boolean, owner: cc.Component): IterableIterator<any> {
		if (callback) {
			if (late) {
				yield new WaitForLateUpdate();
			}
			yield delay;
			callback.call(owner);
		}
	}

	/**
	 * 在条件满足之前，按一定时间间隔循环执行回调
	 * @param interval - 执行回调的时间间隔（秒）
	 * @param loopUntil - 需要执行的回调，也是跳出循环的条件，返回true则跳出循环
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public loop(interval: number, loopUntil: () => boolean | void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doLoop(interval == null ? null : new WaitForSeconds(interval), loopUntil, false, owner), owner);
	}
	/**
	 * 先等到下一个LateUpdate，再在条件满足之前，按一定时间间隔循环执行回调
	 * @param interval - 执行回调的时间间隔（秒）
	 * @param loopUntil - 需要执行的回调，也是跳出循环的条件，返回true则跳出循环
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public lateLoop(interval: number, loopUntil: () => boolean | void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doLoop(interval == null ? null : new WaitForSeconds(interval), loopUntil, true, owner), owner);
	}
	/**
	 * 在条件满足之前，按一定帧间隔循环执行回调
	 * @param interval - 执行回调的帧间隔
	 * @param loopUntil - 需要执行的回调，也是跳出循环的条件，返回true则跳出循环
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public frameLoop(interval: number, loopUntil: () => boolean | void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doLoop(interval == null ? null : new WaitForFrames(interval), loopUntil, false, owner), owner);
	}
	/**
	 * 先等到下一个LateUpdate，再在条件满足之前，按一定帧间隔循环执行回调
	 * @param interval - 执行回调的帧间隔
	 * @param loopUntil - 需要执行的回调，也是跳出循环的条件，返回true则跳出循环
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public lateFrameLoop(interval: number, loopUntil: () => boolean | void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doLoop(interval == null ? null : new WaitForFrames(interval), loopUntil, true, owner), owner);
	}
	private * doLoop(interval: WaitForFrames | WaitForSeconds, loopUntil: () => boolean | void, late: boolean, owner?: cc.Component): IterableIterator<any> {
		if (loopUntil) {
			if (late) {
				yield new WaitForLateUpdate();
			}
			while (!loopUntil.call(owner)) {
				yield interval;
			}
		}
	}

	/**
	 * 等待条件满足后执行回调
	 * @param waitUntil - 等待的条件，返回true则执行回调
	 * @param callback - 需要执行的回调
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public wait(waitUntil: () => boolean, callback: () => void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doWait(waitUntil, callback, false, owner), owner);
	}
	/**
	 * 先等到下一个LateUpdate，再等待条件满足后执行回调
	 * @param waitUntil - 等待的条件，返回true则执行回调
	 * @param callback - 需要执行的回调
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public lateWait(waitUntil: () => boolean, callback: () => void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doWait(waitUntil, callback, true, owner), owner);
	}
	private * doWait(waitUntil: () => boolean, callback: () => void, late: boolean, owner: cc.Component): IterableIterator<any> {
		if (callback) {
			if (late) {
				yield new WaitForLateUpdate();
			}
			if (waitUntil) {
				while (!waitUntil.call(owner)) {
					yield null;
				}
			}
			callback.call(owner);
		}
	}

	/**
	 * 等待条件满足或超时后执行回调
	 * @param waitUntil - 等待的条件，返回true则执行回调
	 * @param timeout - 超时时间
	 * @param callback - 需要执行的回调
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public timeoutWait(waitUntil: () => boolean, timeout: number, callback: (isTimeout: boolean) => void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doTimeoutWait(waitUntil, callback, false, timeout, owner), owner);
	}
	/**
	 * 先等到下一个LateUpdate，再等待条件满足或超时后执行回调
	 * @param waitUntil - 等待的条件，返回true则执行回调
	 * @param timeout - 超时时间
	 * @param callback - 需要执行的回调
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public timeoutLateWait(waitUntil: () => boolean, timeout: number, callback: (isTimeout: boolean) => void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doTimeoutWait(waitUntil, callback, true, timeout, owner), owner);
	}
	private * doTimeoutWait(waitUntil: () => boolean, callback: (isTimeout: boolean) => void, late: boolean, timeout: number, owner: cc.Component): IterableIterator<any> {
		if (callback) {
			if (late) {
				yield new WaitForLateUpdate();
			}
			let timeoutMS = timeout && timeout * 1000 || 0;
			let time = Date.now();
			let isTimeout = false;
			if (waitUntil) {
				while (!(isTimeout = Date.now() - time >= timeoutMS) && !waitUntil.call(owner)) {
					yield null;
				}
			}
			callback.call(owner, isTimeout);
		}
	}

	/**
	 * 等待帧率稳定后执行回调，也可以在迭代器中 yield 返回的协程对象，用于等待帧率稳定
	 * 帧率稳定的定义：最近若干帧（3帧）帧间隔的方差小于一定阈值（0.00001）
	 * 由于帧率可能会一直不稳定，所以用一个最大帧数（20）来避免协程一直在等待中
	 * @param callback - 需要执行的回调
	 * @param owner - 协程的拥有者，可以通过它来批量结束协程
	 * @return 协程对象
	 */
	public endOfLag(callback?: () => void, owner?: cc.Component): Coroutine {
		return this.startCo(this.doEndOfLag(callback, owner), owner);
	}
	private readonly LAG_FRAME_COUNT_MAX = 20;
	private readonly LAG_CHECK_FRAME_COUNT = 3;
	private readonly LAG_CHECK_THRESHOLD = 0.00001;
	private * doEndOfLag(callback: () => void, owner: cc.Component): IterableIterator<any> {
		let maxFrame = cc.director.getTotalFrames() + this.LAG_FRAME_COUNT_MAX;
		let deltaTimeList: number[] = [];
		deltaTimeList.push(cc.director.getDeltaTime());
		yield null;
		deltaTimeList.push(cc.director.getDeltaTime());
		while (cc.director.getTotalFrames() < maxFrame) {
			yield null;
			deltaTimeList.push(cc.director.getDeltaTime());
			if (deltaTimeList.length > this.LAG_CHECK_FRAME_COUNT) {
				deltaTimeList.shift();
			}
			let variance = Math.variance(...deltaTimeList);
			if (variance < this.LAG_CHECK_THRESHOLD) {
				break;
			}
		}
		callback?.call(owner);
	}
}