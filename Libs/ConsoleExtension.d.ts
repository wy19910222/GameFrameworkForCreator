interface Console {
	logRefer(message: string, ...optionalParams: any[]): void;
	debugRefer(message: string, ...optionalParams: any[]): void;
	infoRefer(message: string, ...optionalParams: any[]): void;
	warnRefer(message: string, ...optionalParams: any[]): void;
	errorRefer(message: string, ...optionalParams: any[]): void;
	traceRefer(message: string, ...optionalParams: any[]): void;
}