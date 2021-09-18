/**
 * @auth wangyun
 * @date 2021/8/23-10:53
 */

@jsClass
export class JsonUtils {
	/**
	 * 压缩/解压json
	 * @param jsonStr 需要压缩/解压的json字符串
	 * @param deep 从外到内，带格式的层数，0表示无格式，null表示全格式
	 */
	public static format(jsonStr: string, deep: number): string {
		return jsonStr ? this.stringify(JSON.parse(jsonStr), deep) : "";
	}

	/**
	 * 将对象转换成带格式的字符串
	 * @param jsonObj 需要转换成字符串的对象
	 * @param deep 从外到内，带格式的层数，0表示无格式，null表示全格式
	 * @param retract 递归调用时缩进之用，一般情况下不要传参
	 */
	public static stringify(jsonObj: any, deep: number, retract?: string): string {
		retract || (retract = "");
		let nextRetract = retract + "\t";
		let recursion = deep == null || deep-- > 1;
		let strs = [];
		if (jsonObj instanceof Array) {
			jsonObj.forEach(element => {
				let itemStrs = [nextRetract];
				if (recursion && element instanceof Object) {
					itemStrs.push(this.stringify(element, deep, nextRetract));
				} else {
					itemStrs.push(JSON.stringify(element));
				}
				strs.push(itemStrs.join(""));
			});
			return ["[", "\r\n", strs.join(",\r\n"), "\r\n", retract, "]"].join("");
		} else if (jsonObj instanceof Object) {
			for (let key in jsonObj) {
				if (jsonObj.hasOwnProperty(key)) {
					let element = jsonObj[key];
					let itemStrs = [nextRetract, JSON.stringify(key), ": "];
					if (recursion && element instanceof Object) {
						itemStrs.push(this.stringify(element, deep, nextRetract));
					} else {
						itemStrs.push(JSON.stringify(element));
					}
					strs.push(itemStrs.join(""));
				}
			}
			return ["{", "\r\n", strs.join(",\r\n"), "\r\n", retract, "}"].join("");
		} else {
			return JSON.stringify(jsonObj);
		}
	}
}