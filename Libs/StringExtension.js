String.prototype.startsWith = String.prototype.startsWith || function (searchString, position) {
	return this.indexOf(searchString, position) === position;
};
String.prototype.endsWith = String.prototype.endsWith || function (searchString, position) {
	position == null && (position = this.length);
	let index = this.lastIndexOf(searchString);
	return index !== -1 && index === (position - searchString.length);
};
String.prototype.includes = String.prototype.includes || function (searchString, position) {
	return this.indexOf(searchString, position) !== -1;
};
String.prototype.repeat = String.prototype.repeat || function (count) {
	let strBuffers = [];
	for (let index = 0; index < count; ++index) {
		strBuffers.push(this.toString());
	}
	return strBuffers.join("");
};
String.prototype.padStart = String.prototype.padStart || function (maxLength, fillString) {
	if (fillString === "") {
		return this.toString();
	}

	maxLength = maxLength || 0;
	fillString = fillString === null ? "null" : fillString === undefined ? " " : fillString;

	let padLength = maxLength - this.length;
	let fillLength = fillString.length;
	let repeat = Math.max(padLength / fillLength, 0);
	let model = Math.max(padLength % fillLength, 0);

	return fillString.repeat(repeat) + fillString.slice(0, model) + this;
};
String.prototype.padEnd = String.prototype.padEnd || function (maxLength, fillString) {
	if (fillString === "") {
		return this.toString();
	}

	maxLength = maxLength || 0;
	fillString = fillString === null ? "null" : fillString === undefined ? " " : fillString;

	let padLength = maxLength - this.length;
	let fillLength = fillString.length;
	let repeat = Math.max(padLength / fillLength, 0);
	let model = Math.max(padLength % fillLength, 0);

	return this + fillString.repeat(repeat) + fillString.slice(0, model);
};
String.prototype.format = function (...args) {
	let result = this.toString();

	let argLength = args.length;
	if (argLength === 0) {
		return this.toString();
	}

	if (argLength === 1 && args[0] instanceof Object) {
		let arg = args[0];
		for (let key in arg) {
			if (arg.hasOwnProperty(key)) {
				let reg = new RegExp(`\\{${key}\\}`, "g");
				result = result.replace(reg, arg[key]);
			}
		}
	} else {
		for (let index = 0; index < argLength; index++) {
			let arg = args[index];

			let indexStr = index.toString();
			let regNormal = new RegExp(`\\{${indexStr}\\}`, "g");
			result = result.replace(regNormal, arg);
			let regExtend = new RegExp(`\\{${indexStr}:[^{}:]+\\}`, "g");
			let prefixLength = indexStr.length + 2;
			result = result.replace(regExtend, match => {
				let param = match.substring(prefixLength, match.length - 1);
				return String.formatParamFunc(arg, param);
			});
		}
	}
	return result;
};
String.formatParamFunc = function (arg, param) {
	// {1:D2} 当第二个参数是整型数字时，用0补到2位以上
	if (/^D\d+$/.test(param)) {
		if (Number.isInteger(arg)) {
			let padNum = Number.parseInt(param.substring(1));
			return (arg + "").padStart(padNum, "0");
		}
	}
	// {1:N2} 当第二个参数是数字时，保留2位小数
	else if (/^N\d+$/.test(param)) {
		if (arg === +arg) {
			let num = Number.parseInt(param.substring(1));
			let rate = Math.pow(10, num);
			return Math.round(arg * rate) / rate;
		}
	}
	// {1:|abc} 当第二个参数是null、undefined、0或空字符串时，替换成abc
	else if (param.startsWith("|")) {
		return arg ? arg + "" : param.substring(1);
	}
	// {1:&abc} 当第二个参数不是null、undefined、0或空字符串时，追加上abc，否则为空字符串
	else if (param.startsWith("&")) {
		return arg ? arg + param.substring(1) : "";
	}
	return arg;
};

String.prototype.replaceAll = function(searchValue, replaceValue, multipleLine) {
	return this.replace(new RegExp(searchValue, multipleLine ? "gm" : "g"), replaceValue);
};