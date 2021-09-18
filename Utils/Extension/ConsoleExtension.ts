/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

export namespace ConsoleExtension {
	let getTimeStr = function() {
		let date = new Date();
		return date.toCustomString("MM/dd HH:mm:ss.fff");
	};
	let printRefer = function (printFunc: (message?: any, ...optionalParams: any[]) => void, message?: any, ...optionalParams: any[]) {
		let params = [];
		optionalParams.forEach(optionalParam => {
			if (optionalParam instanceof Object) {
				referEnabled && params.push(optionalParam);
				params.push(JSON.stringify(optionalParam));
			} else {
				params.push(optionalParam);
			}
		});
		printFunc(message, ...params);
	};

	let log = console.log;
	let newLog = function (message?: any, ...optionalParams: any[]) {
		let timeStr = getTimeStr();
		log(timeStr, message, ...optionalParams);
		printCallback && printCallback("log", timeStr, message, ...optionalParams);
	};
	let debug = console.debug;
	let newDebug = function (message?: any, ...optionalParams: any[]) {
		let timeStr = getTimeStr();
		debug(timeStr, message, ...optionalParams);
		printCallback && printCallback("debug", timeStr, message, ...optionalParams);
	};
	let info = console.info;
	let newInfo = function (message?: any, ...optionalParams: any[]) {
		let timeStr = getTimeStr();
		info(timeStr, message, ...optionalParams);
		printCallback && printCallback("info", timeStr, message, ...optionalParams);
	};
	let warn = console.warn;
	let newWarn = function (message?: any, ...optionalParams: any[]) {
		let timeStr = getTimeStr();
		warn(timeStr, message, ...optionalParams);
		printCallback && printCallback("warn", timeStr, message, ...optionalParams);
	};
	let error = console.error;
	let newError = function (message?: any, ...optionalParams: any[]) {
		let timeStr = getTimeStr();
		error(timeStr, message, ...optionalParams);
		printCallback && printCallback("error", timeStr, message, ...optionalParams);
	};
	let trace = console.trace;
	let newTrace = function (message?: any, ...optionalParams: any[]) {
		let timeStr = getTimeStr();
		trace(timeStr, message, ...optionalParams);
		printCallback && printCallback("trace", timeStr, message, ...optionalParams);
	};

	let noLog = function (message?: any, ...optionalParams: any[]) {
		printCallback && printCallback("log", getTimeStr(), message, ...optionalParams);
	};
	let noDebug = function (message?: any, ...optionalParams: any[]) {
		printCallback && printCallback("debug", getTimeStr(), message, ...optionalParams);
	};
	let noInfo = function (message?: any, ...optionalParams: any[]) {
		printCallback && printCallback("info", getTimeStr(), message, ...optionalParams);
	};
	let noWarn = function (message?: any, ...optionalParams: any[]) {
		printCallback && printCallback("warn", getTimeStr(), message, ...optionalParams);
	};
	let noError = function (message?: any, ...optionalParams: any[]) {
		printCallback && printCallback("error", getTimeStr(), message, ...optionalParams);
	};
	let noTrace = function (message?: any, ...optionalParams: any[]) {
		printCallback && printCallback("trace", getTimeStr(), message, ...optionalParams);
	};

	let referEnabled = false;
	export function setReferEnabled(enabled: boolean) {
		referEnabled = enabled;
	}
	let printCallback: (type: string, time: string, message?: any, ...optionalParams: any[]) => void;
	export function setPrintCallback(callback: (type: string, time: string, message?: any, ...optionalParams: any[]) => void) {
		printCallback = callback;
	}
	export function setEnabled(enabled: boolean) {
		if (enabled) {
			console.log = newLog;
			console.debug = newDebug;
			console.info = newInfo;
			console.warn = newWarn;
			console.error = newError;
			console.trace = newTrace;
		} else {
			console.log = noLog;
			console.debug = noDebug;
			console.info = noInfo;
			console.warn = noWarn;
			console.error = noError;
			console.trace = noTrace;
		}
		console.logRefer = printRefer.bind(this, console.log);
		console.debugRefer = printRefer.bind(this, console.debug);
		console.infoRefer = printRefer.bind(this, console.info);
		console.warnRefer = printRefer.bind(this, console.warn);
		console.errorRefer = printRefer.bind(this, console.error);
		console.traceRefer = printRefer.bind(this, console.trace);
	}
	setEnabled(true);
}