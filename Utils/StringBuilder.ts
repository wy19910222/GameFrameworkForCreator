/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

export class StringBuilder {
	private _buffers: string[];
	private _length: number;
	
	private _splitChar: string;
	public get splitChar() : string {
		return this._splitChar;
	}
	public set splitChar(value: string) {
		this._splitChar = value;
	}

	public get isEmpty(): boolean {
		return this._buffers.length <= 0;
	}

	public get length(): number {
		let splitCharLength = this._splitChar === "" ? 0 : this._splitChar === undefined ? 1 : this._splitChar === null ? 4 : this._splitChar.length;
		return splitCharLength > 0 && !this.isEmpty ? this._length + splitCharLength * (this._buffers.length - 1) : this._length;
	}
	
	constructor(splitChar = "", ...strs: string[]) {
		this._splitChar = splitChar;
		this._buffers = [...strs];
		this._length = 0;
		for (let str of strs) {
			if (str) {
				this._length += str.length;
			}
		}
	}

	public clear(): void {
		this._buffers.length = 0;
		this._length = 0;
	}

	public append(str: string): void {
		this._length += str ? str.length : 0;
		this._buffers.push(str);
	}

	public pop(): string {
		let str = this._buffers.pop();
		this._length -= str ? str.length : 0;
		return str;
	}

	public toString(): string {
		return this._buffers.join(this._splitChar);
	}
}