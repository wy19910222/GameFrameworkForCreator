Function.prototype.tailBind = function (thisArg, ...argArray) {
	let original = this;
	return function (...args) {
		return original.call(thisArg, ...args, ...argArray);
	};
};
Function.prototype.combineAfter = function (thisArg, after) {
	let original = this;
	return function (...args) {
		let caller = thisArg || this;
		let result = original.apply(caller, args);
		after.apply(caller, args);
		return result;
	};
};
Function.prototype.combineBefore = function (thisArg, before) {
	let original = this;
	return function (...args) {
		let caller = thisArg || this;
		before.apply(caller, args);
		return original.apply(caller, args);
	};
};