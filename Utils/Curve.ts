/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

@jsClass("CurveKeyFrame")
export class CurveKeyFrame {
	public _time?: number;
	public get time(): number {
		return this._time || 0;
	}
	
	public _value?: number;
	public get value(): number {
		return this._value || 0;
	}
	public set value(value: number) {
		this._value = value;
	}

	public _inTangent?: number;
	public get inTangent(): number {
		return this._inTangent || 0;
	}
	public set inTangent(value: number) {
		this._inTangent = value;
	}

	public _outTangent?: number;
	public get outTangent(): number {
		return this._outTangent || 0;
	}
	public set outTangent(value: number) {
		this._outTangent = value;
	}

	constructor(time?:number, value?: number, inTangent?: number, outTangent?: number) {
		this._time = time;
		this._value = value;
		this._inTangent = inTangent;
		this._outTangent = outTangent;
	}
}

@jsClass
export class Curve {
	// Const of 1, do not modify
	public static readonly CONST = new Curve(new CurveKeyFrame(1, 1));
	// Linear of 0 to 1, do not modify
	public static readonly LINEAR = new Curve(new CurveKeyFrame(0, 0, 1, 1), new CurveKeyFrame(1, 1, 1, 1));
	// EaseIn of 0 to 1, do not modify
	public static readonly EASE_IN = new Curve(new CurveKeyFrame(0, 0, 0, 0), new CurveKeyFrame(1, 1, 2, 2));
	// EaseOut of 0 to 1, do not modify
	public static readonly EASE_OUT = new Curve(new CurveKeyFrame(0, 0, 2, 2), new CurveKeyFrame(1, 1, 0, 0));
	// Swing of 0 to 1, do not modify
	public static readonly SWING = new Curve(new CurveKeyFrame(0, 0, 0, 0), new CurveKeyFrame(1, 1, 0, 0));
	// Ease pingpong of 0 - 1 - 0, do not modify
	public static readonly EASE_PINGPONG = new Curve(new CurveKeyFrame(0, 0, 0, 0), new CurveKeyFrame(0.5, 1, 0, 0), new CurveKeyFrame(1, 0, 0, 0));
	// Ease parabola of 0 - 1 - 0, do not modify
	public static readonly EASE_PARABOLA = new Curve(new CurveKeyFrame(0, 0, 4, 4), new CurveKeyFrame(0.5, 1, 0, 0), new CurveKeyFrame(1, 0, -4, -4));

	private _keyFrames: CurveKeyFrame[] = [];

	public get length(): number {
		return this._keyFrames.length;
	}

	constructor(...keyFrames: CurveKeyFrame[]) {
		this._keyFrames = [];
		for (let index = 0, length = keyFrames.length; index < length; ++index) {
			this.add(keyFrames[index]);
		}
		this.ease = this.ease.bind(this);
	}

	public evaluate(time: number): number {
		let length = this.length;
		if (length === 0) {
			return 0;
		}
		if (length === 1) {
			return this._keyFrames[0].value;
		}

		time = time || 0;
		let { prevIndex, nextIndex } = this.indexOf(time);
		if (prevIndex === nextIndex) {
			return this._keyFrames[nextIndex].value;
		}
		if (prevIndex === -1) {
			return this._keyFrames[0].value;
		}
		if (nextIndex === length) {
			return this._keyFrames[length - 1].value;
		}

		let prevKetFrame = this._keyFrames[prevIndex];
		let nextKetFrame = this._keyFrames[nextIndex];
		// let dx = x1 - x0
		let dx = nextKetFrame.time - prevKetFrame.time;
		// let dxt = x - x0, then x - x1 = dxt - dx
		let dxt = time - prevKetFrame.time;
		// let t = (x - x0)/(x1 - x0), then (x - x1)/(x0 - x1) = (x1 - x)/(x1 - x0) = 1 - t
		let t = dxt / dx;
		let t2 = t * t;
		let t3 = t2 * t;

		// α0 = (1 + 2(x - x0)/(x1 - x0))((x - x1)/(x0 - x1))^2
		// α0 = (1 + 2t)(1 - t)^2
		// α0 = 2t^3 - 3t^2 + 1
		let a0 = 2 * t3 - 3 * t2 + 1;
		// α1 = (1 + 2(x - x1)/(x0 - x1))((x - x0)/(x1 - x0))^2
		// α1 = (1 + 2(1 - t))t^2
		// α1 = (3 - 2t))t^2
		// α1 = -2t^3 + 3t^2
		let a1 = -2 * t3 + 3 * t2;
		// β0 = (x - x0)((x - x1)/(x0 - x1))^2
		// β0 = dxt(1 - t)^2
		// β0 = dxt(t^2 - 2t + 1)
		let b0 = dxt * (t2 - 2 * t + 1);
		// β1 = (x - x1)((x - x0)/(x1 - x0))^2
		// β1 = (dxt - dx)t^2
		let b1 = (dxt - dx) * t2;
		
		// y0α0 + y1α1 + k0β0 + k1β1
		return prevKetFrame.value * a0 + nextKetFrame.value * a1 + prevKetFrame.outTangent * b0 + nextKetFrame.inTangent * b1;
	}

	public get(index: number): CurveKeyFrame {
		return this._keyFrames[index];
	}

	public add(keyFrame: CurveKeyFrame): void {
		if (this.length === 0) {
			this._keyFrames.push(keyFrame);
			return;
		}
		let { prevIndex, nextIndex } = this.indexOf(keyFrame && keyFrame.time);
		if (prevIndex === nextIndex) {
			this._keyFrames[nextIndex] = keyFrame;
		} else {
			this._keyFrames.splice(nextIndex, 0, keyFrame);
		}
	}

	private indexOf(time: number): { prevIndex: number, nextIndex: number } {
		time = time || 0;
		let length = this._keyFrames.length;
		for (let index = 0; index < length; ++index) {
			let keyFrame = this._keyFrames[index];
			let _time = keyFrame ? keyFrame.time : 0;
			if (_time === time) {
				return { prevIndex: index, nextIndex: index};
			} else if (_time > time) {
				return { prevIndex: index - 1, nextIndex: index };
			}
		}
		return { prevIndex: length - 1, nextIndex: length };
	}

	public remove(index: number): CurveKeyFrame {
		return this._keyFrames.splice(index, 1)[0];
	}

	public autoTangents(index: number): void {
		if (index && index >= 0 && index < this.length) {
			this.autoKeyFrameTangents(index);
		}
	}

	private autoKeyFrameTangents(index: number): void {
		let keyFrame = this.getKeyFrame(index, false);
		let prevKetFrame = this._keyFrames[index - 1];
		let nextKetFrame = this._keyFrames[index + 1];
		let leftLinearTangent = prevKetFrame && (keyFrame.value - prevKetFrame.value) / (keyFrame.time - prevKetFrame.time || Number.EPSILON);
		let rightLinearTangent = nextKetFrame && (nextKetFrame.value - keyFrame.value) / (nextKetFrame.time - keyFrame.time || Number.EPSILON);
		let smoothTangent = leftLinearTangent && rightLinearTangent ? (leftLinearTangent + rightLinearTangent) / 2 : rightLinearTangent || rightLinearTangent;
		if (smoothTangent) {
			keyFrame.inTangent = smoothTangent;
			keyFrame.outTangent = smoothTangent;
		}
	}

	public flatTangents(index: number): void {
		if (index && index >= 0 && index < this.length) {
			this.flatKeyFrameTangents(index);
		}
	}

	private flatKeyFrameTangents(index: number): void {
		let keyFrame = this.getKeyFrame(index, false);
		keyFrame.inTangent = 0;
		keyFrame.outTangent = 0;
	}

	private getKeyFrame(index: number, nullable = true): CurveKeyFrame {
		let keyFrame = this._keyFrames[index];
		if (!nullable && !keyFrame) {
			keyFrame = new CurveKeyFrame();
			this._keyFrames[index] = keyFrame;
		}
		return keyFrame;
	}

	public cleanup(): void {
		this._keyFrames = [];
	}

	/**
	 * 方法以曲线轨迹运动。
	 * @param t The current time as a percentage of the total time.
	 */
	public ease(t: number): number {
		return this.evaluate(t);
	}
}