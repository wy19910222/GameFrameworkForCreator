Number.prototype.toFloated = function (fractionDigits) {
	return +this.toFixed(fractionDigits) + "";
};