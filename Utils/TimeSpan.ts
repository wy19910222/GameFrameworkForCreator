/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

@jsClass
export class TimeSpan {
	private readonly HOURS_PER_DAY = 24;
	private readonly MINUTES_PER_HOUR = 60;
	private readonly SECONDS_PER_MINUTE = 60;
	private readonly Milli_PER_SECOND = 1000;

	private readonly _milliseconds: number;

	private readonly _totalSeconds: number;
	private readonly _seconds: number;
	private readonly _totalMinutes: number;
	private readonly _minutes: number;
	private readonly _totalHours: number;
	private readonly _hours: number;
	private readonly _totalDays: number;
	private readonly _days: number;

	constructor(milliseconds: number) {
		this._milliseconds = milliseconds || 0;

		this._totalSeconds = this._milliseconds / this.Milli_PER_SECOND;
		this._seconds = Math.floor(this._totalSeconds) % this.SECONDS_PER_MINUTE;
		this._totalMinutes = this._totalSeconds / this.SECONDS_PER_MINUTE;
		this._minutes = Math.floor(this._totalMinutes) % this.MINUTES_PER_HOUR;
		this._totalHours = this._totalMinutes / this.MINUTES_PER_HOUR;
		this._hours = Math.floor(this._totalHours) % this.HOURS_PER_DAY;
		this._totalDays = this._totalHours / this.HOURS_PER_DAY;
		this._days = Math.floor(this._totalDays);
	}

	public get totalSeconds(): number {
		return this._totalSeconds;
	}

	public get seconds(): number {
		return this._seconds;
	}

	public get totalMinutes(): number {
		return this._totalMinutes;
	}

	public get minutes(): number {
		return this._minutes;
	}

	public get totalHours(): number {
		return this._totalHours;
	}

	public get hours(): number {
		return this._hours;
	}

	public get totalDays(): number {
		return this._totalDays;
	}

	public get days(): number {
		return this._days;
	}

	public toString(): string {
		let seconds = this._seconds + "";
		let minutes = this._minutes + "";
		let str = minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0");
		if (this._hours > 0) {
			let hours = this._hours + "";
			str = hours.padStart(2, "0") + ":" + str;
		}
		if (this._days > 0) {
			let days = this._days + "";
			str = days.padStart(2, "0") + ":" + str;
		}
		return str;
	}

	public toCustomString(formatStr: string): string {
		if (formatStr) {
			let days = this._days + "";
			let hours = this._hours + "";
			let minutes = this._minutes + "";
			let seconds = this._seconds + "";
			return formatStr.replace(/d{2,}/, days.padStart(2, "0")).replace("d", days)
				.replace(/H{2,}/, hours.padStart(2, "0")).replace("H", hours)
				.replace(/h{2,}/, hours.padStart(2, "0")).replace("h", hours)
				.replace(/m{2,}/, minutes.padStart(2, "0")).replace("m", minutes)
				.replace(/s{2,}/, seconds.padStart(2, "0")).replace("s", seconds);
		}
		return this.toString();
	}
}