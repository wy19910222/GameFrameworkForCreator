interface MediaRecorderOptions {
	mimeType:string;
	audioBitsPerSecond: number;
	videoBitsPerSecond: number;
	bitsPerSecond: number;
}

class MediaRecorder extends EventTarget {
	static isTypeSupported(type: DOMString): boolean;

	readonly stream: MediaStream;
	readonly mimeType: string;
	readonly state: "inactive" | "recording" | "paused";

	readonly videoBitsPerSecond: number;
	readonly audioBitsPerSecond: number;
	readonly audioBitrateMode: "constant" | "variable";

	public onstart: (event: Event) => void;
	public onstop: (event: Event) => void;
	public ondataavailable: (event: BlobEvent) => void;
	public onpause: (event: Event) => void;
	public onresume: (event: Event) => void;
	public onerror: (event: Event) => void;

	constructor(stream: MediaStream, options: MediaRecorderOptions = {});

	public start(timeSlice?: number): void;
	public stop(): void;
	public pause(): void;
	public resume(): void;
	public requestData(): void;
}