/**
 * @auth wangyun
 * @date 2021/2/4-15:56
 */

export class Point {
	public x: number;
	public y: number;
	public z: number;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

export interface PointData {
	p: Point;

	a: Point;
	b: Point;
	c: Point;
	d: Point;
	t: number;
}

export class CatmullRom {
	private _pointDatas: PointData[] = [];
	public get pointDatas(): PointData[] {
		return this._pointDatas;
	}

	private _pointPros: number[];

	private _totalDs: number;
	public get totalDis(): number {
		return this._totalDs;
	}

	constructor(ps: Point[], maxDis: number, loop?: boolean) {
		if (ps && ps.length > 2) {
			this.calculatePointDatas([...ps], maxDis, loop);
		} else {
			throw new Error("Parameter error!");
		}
	}

	private calculatePointDatas(ps: Point[], maxDis: number, loop?: boolean): void {
		let p0 = ps[0];
		let pEnd = ps[ps.length - 1];
		if (loop) {
			let p1 = ps[1];
			ps.unshift(pEnd);	// 第一个点之前是最后一个点
			ps.push(p0);	// 新增从最后一个点到第一个点的线段
			ps.push(p1);	// 第一个点之后是第二个点
		} else {
			ps.unshift(pEnd);	// 第一个点之前是最后一个点
			ps.push(p0);	// 最后一个点之后是第一个点
		}
		this._pointDatas.length = 0;
		for (let index = 0, max = ps.length - 4; index <= max; ++index) {
			let p0 = ps[index];
			let p1 = ps[index + 1];
			let p2 = ps[index + 2];
			let p3 = ps[index + 3];
			let pointDatas = this.drawSpline(p0, p1, p2, p3, maxDis);
			index < max && pointDatas.pop();
			this._pointDatas.push(...pointDatas);
		}
		this._totalDs = 0;
		let pointDis: number[] = [0];
		for (let index = 0, length = this._pointDatas.length - 1; index < length; ++index) {
			let ptData1 = this._pointDatas[index];
			let ptData2 = this._pointDatas[index + 1];
			let deltaX = ptData2.p.x - ptData1.p.x;
			let deltaY = ptData2.p.y - ptData1.p.y;
			let dis = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			this._totalDs += dis;
			pointDis.push(this._totalDs);
		}
		this._pointPros = pointDis.map(dis => dis / this._totalDs);
	}

	public evaluate(progress: number): Point {
		if (progress <= 0) {
			return this._pointDatas[0].p;
		} else if (progress >= 1) {
			return this._pointDatas[this._pointDatas.length - 1].p;
		}

		let index = 0;
		for (let i = this._pointPros.length - 1; i >= 0; --i) {
			if (progress > this._pointPros[i]) {
				index = i;
				break;
			}
		}
		let prevPro = this._pointPros[index];
		let nextPro = this._pointPros[index + 1];
		let percent = (progress - prevPro) / (nextPro - prevPro);
		let prevPData = this._pointDatas[index];
		let nextPData = this._pointDatas[index + 1];
		let prevT = prevPData.t;
		let nextT = nextPData.t || 1;	// 如果t是0，说明是原始线段最后一个点
		let t = prevT * (1 - percent) + nextT * percent;
		let tSq = t * t;
		let tCub = tSq * t;
		return this.evaluateByABCD(prevPData.a, prevPData.b, prevPData.c, prevPData.d, t, tSq, tCub);
	}

	public drawSpline(p0: Point, p1: Point, p2: Point, p3: Point, maxDis: number): PointData[] {
		let a = new Point(p1.x * 2, p1.y * 2, p1.z * 2);
		let b = new Point(p2.x - p0.x, p2.y - p0.y, p2.z - p0.z);
		let c = new Point(p0.x * 2 - p1.x * 5 + p2.x * 4 - p3.x, p0.y * 2 - p1.y * 5 + p2.y * 4 - p3.y, p0.z * 2 - p1.z * 5 + p2.z * 4 - p3.z);
		let d = new Point(-p0.x + p1.x * 3 - p2.x * 3 + p3.x, -p0.y + p1.y * 3 - p2.y * 3 + p3.y, -p0.z + p1.z * 3 - p2.z * 3 + p3.z);
		return this.tessellate({p: p1, a, b, c, d, t: 0}, {p: p2, a, b, c, d, t: 1}, maxDis);
	}

	private tessellate(p1: PointData, p2: PointData, maxDis: number): PointData[] {
		let head = {item: p1, next: {item: p2}};
		this.bisection(head, maxDis);
		let array = [];
		let node = head;
		while (node) {
			array.push(node.item);
			node = <any>node.next;
		}
		return array;
	}

	private bisection(prev: {item: PointData, next: {item: PointData}}, maxDis: number): void {
		let ptData1 = prev.item;
		let ptData2 = prev.next.item;
		let deltaX = ptData2.p.x - ptData1.p.x;
		let deltaY = ptData2.p.y - ptData1.p.y;
		if (deltaX * deltaX + deltaY * deltaY > maxDis * maxDis) {
			let t = (ptData1.t + ptData2.t) * 0.5;
			let tSq = t * t;
			let tCub = tSq * t;
			let p = this.evaluateByABCD(ptData1.a, ptData1.b, ptData1.c, ptData1.d, t, tSq, tCub);
			let curr = {item: {...ptData1, p, t}, next: prev.next};
			prev.next = curr;
			this.bisection(prev, maxDis);
			this.bisection(curr, maxDis);
		}
	}

	private evaluateByABCD(a: Point, b: Point, c: Point, d: Point, t: number, tSq: number, tCub: number): Point {
		return new Point(
			(a.x + (b.x * t) + (c.x * tSq) + (d.x * tCub)) * 0.5,
			(a.y + (b.y * t) + (c.y * tSq) + (d.y * tCub)) * 0.5,
			(a.z + (b.z * t) + (c.z * tSq) + (d.z * tCub)) * 0.5
		);
	}
}