Date.prototype.toCustomString = function (formatStr) {
	if (formatStr) {
		let year = this.getFullYear() + "";
		let month = this.getMonth() + 1 + "";
		let date = this.getDate() + "";
		let hours = this.getHours();
		let hours24 = hours + "";
		let hours12 = hours % 12 + "";
		let minutes = this.getMinutes() + "";
		let seconds = this.getSeconds() + "";
		let milliSeconds = this.getMilliseconds();
		let ms = milliSeconds + "";
		let ms10 = Math.floor(milliSeconds / 10) + "";
		let ms100 = Math.floor(milliSeconds / 100) + "";
		return formatStr.replace(/ms|f{3,}/g, ms.padStart(3, "0")).replace(/ff/g, ms10.padStart(2, "0")).replace(/f/g, ms100)
			.replace(/y{3,}/g, year).replace(/y{1,2}/g, year.substring(2))
			.replace(/M{2,}/g, month.padStart(2, "0")).replace(/M/g, month)
			.replace(/d{2,}/g, date.padStart(2, "0")).replace(/d/g, date)
			.replace(/H{2,}/g, hours24.padStart(2, "0")).replace(/H/g, hours24)
			.replace(/h{2,}/g, hours12.padStart(2, "0")).replace(/h/g, hours12)
			.replace(/m{2,}/g, minutes.padStart(2, "0")).replace(/m/g, minutes)
			.replace(/s{2,}/g, seconds.padStart(2, "0")).replace(/s/g, seconds);
	}
	return this.toString();
};