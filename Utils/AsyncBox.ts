/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

/**
 * 执行某一操作的封装，一般用于异步获取某个对象
 * @tag 自定义标记，用于区分
 * @isDone 是否结束，无论成功或失败
 * @isSucceed 是否成功，未结束时为否
 * @result 结果对象，对象 == true 则为成功，否则为失败
 * @then 添加一个执行成功时的回调，如果已经执行结束并成功，则直接调用，失败则无任何操作
 * @catch 添加一个执行失败时的回调，如果已经执行结束并失败，则直接调用，成功则无任何操作
 * @finally 添加一个执行结束时的回调，无论成功或失败，在所有 then 或 catch 的回调执行完后执行
 */
export class AsyncBox<T> {
	private readonly _tag: any;
	public get tag(): any {
		return this._tag;
	}

	private _isDone = false;
	public get isDone(): boolean {
		return this._isDone;
	}
	private _isSucceed = false;
	public get isSucceed(): boolean {
		return this._isSucceed;
	}

	private _result: T;
	public get result(): T {
		return this._result;
	}
	private _reason: any;
	public get reason(): any {
		return this._reason;
	}

	private _canceled: boolean;
	public get canceled(): any {
		return this._canceled;
	}

	private _thenArray: ((item: T) => void)[] = [];
	private _catchArray: ((reason: any) => void)[] = [];
	private _finallyArray: ((item: T, reason: any) => void)[] = [];

	constructor(promise: Promise<T>, tag?: any) {
		this._tag = tag;
		promise.then(
			value => {
				this._result = value;
				if (this._canceled) {
					this.done(false);
				} else {
					this.done(true);
				}
			},
			reason => {
				this._reason = reason;
				this.done(false);
			}
		);
	}

	private done(isSucceed: boolean): void {
		if (!this._isDone) {
			this._isDone = true;
			this._isSucceed = isSucceed;
			if (isSucceed) {
				for (let success of this._thenArray) {
					try { success && success(this.result); } catch (e) { console.error(e); }
				}
			} else {
				this._isSucceed = false;
				for (let fail of this._catchArray) {
					try { fail && fail(this.reason); } catch (e) { console.error(e); }
				}
			}
			for (let complete of this._finallyArray) {
				try { complete && complete(this.result, this.reason); } catch (e) { console.error(e); }
			}
			this._thenArray = null;
			this._catchArray = null;
			this._finallyArray = null;
		}
	}

	public cancel(): void {
		this._canceled = true;
	}

	public then(thenCall: (item: T) => void): void {
		if (thenCall) {
			if (!this._isDone) {
				this._thenArray.push(thenCall);
			} else if (this.isSucceed) {
				try { thenCall(this._result); } catch (e) { console.error(e); }
			}
		}
	}

	public catch(catchCall: (reason?: any) => void): void {
		if (catchCall) {
			if (!this._isDone) {
				this._catchArray.push(catchCall);
			} else if (!this.isSucceed) {
				try { catchCall(this.reason); } catch (e) { console.error(e); }
			}
		}
	}

	public finally(finallyCall: (item: T, reason?: any) => void): void {
		if (finallyCall) {
			if (!this._isDone) {
				this._finallyArray.push(finallyCall);
			} else {
				try { finallyCall(this._result, this.reason); } catch (e) { console.error(e); }
			}
		}
	}
}