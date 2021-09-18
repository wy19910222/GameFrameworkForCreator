declare interface StringConstructor {
	formatParamFunc(obj: any, param: string): string;
}
declare interface String {
	padStart(this: String, maxLength: number, fillString?: string): string;
	padEnd(this: String, maxLength: number, fillString?: string): string;
	format(this: String, ...args: any[]): string;
	replaceAll(searchValue: string, replaceValue: string, multipleLine?: boolean): string;
}