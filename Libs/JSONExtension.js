JSON.parseBy = function (text, proto, reviver) {
	let obj = this.parse(text, reviver);
	return obj && proto ? obj : Object.setPrototypeOf(obj, proto);
};