/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

export interface HttpRequestParams {
	url?: string;
	method?: string; // "GET" "POST" "DELETE"
	responseType?: XMLHttpRequestResponseType; // 期望的返回数据类型:"json" "text" "document" ...
	async?: boolean;
	body?: BodyInit;
	headers?: { [key: string]: string };
	timeout?: number;
}

@jsClass
export class HttpUtil {
	public static post<T>(url: string, sendData: Object | string, headers?: { [key: string]: string }, noLog?: boolean): Promise<T> {
		return this.request(url, "POST", sendData, headers, noLog);
	}

	public static get<T>(url: string, sendData?: Object | string, headers?: { [key: string]: string }, noLog?: boolean): Promise<T> {
		return this.request(url, "GET", sendData, headers, noLog);
	}

	public static request<T>(url: string, method: string, sendData: Object | string, headers?: { [key: string]: string }, noLog?: boolean): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			let params = this.packParams(url, method, sendData, "", Object.assign({"Content-Type": "application/x-www-form-urlencoded"}, headers));
			noLog || console.log(`HttpUtil ${params.method} ${params.url}:`, params.body);

			let startTime = Date.now();
			this._request(params).then(
				(result: { status: number, data: string }) => {
					let data: string | T = result.data;
					try { data && (data = JSON.parse(data)); } catch (e) { console.warn(e); }
					if (!noLog) {
						let duration = Date.now() - startTime;
						console.log(`HttpUtil response [cost:${duration}ms] ${url}:`, data);
					}
					try {
						resolve(<T>data);
					} catch (e) {
						console.error(e);
					}
				},
				(reason: { status: number, message: string }) => {
					let duration = Date.now() - startTime;
					console.error(`HttpUtil error [cost:${duration}ms] ${url}:`, reason.message);
					try {
						reject(reason.message);
					} catch (e) {
						console.error(e);
					}
				}
			);
		});
	}

	public static upload(host: string, data: { urlKey: string, remoteUrl: string, fileKey: string, file: Blob }, extData: Object, noLog?: boolean): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			noLog || console.log(`HttpUtil upload ${host}/${data.remoteUrl}.`);

			let formData = new FormData();
			if (extData) {
				for (let key in extData) {
					if (extData.hasOwnProperty(key)) {
						let element = extData[key];
						formData.append(key, element + "");
					}
				}
			}
			formData.append(data.urlKey, data.remoteUrl);
			formData.append(data.fileKey, data.file);
			let params = this.packParams(host, "POST", formData, "", {}, 30000);

			let startTime = Date.now();
			this._request(params).then(
				(result: { status: number, data: any }) => {
					try {
						if (!noLog) {
							let duration = Date.now() - startTime;
							console.log(`HttpUtil upload succeed [cost:${duration}ms] ${host}/${data.remoteUrl}:`, result.data);
						}
						resolve(`${host}/${data.remoteUrl}`);
					} catch (e) {
						console.error(e);
					}
				},
				(reason: { status: number, message: string }) => {
					try {
						let duration = Date.now() - startTime;
						console.error(`HttpUtil upload failed [cost:${duration}ms] ${host}/${data.remoteUrl}:`, reason.message);
						reject(reason.message);
					} catch (e) {
						console.error(e);
					}
				}
			);
		});
	}

	public static download(url: string, sendData: Object | string, noLog?: boolean): Promise<BlobPart> {
		return new Promise<BlobPart>((resolve, reject) => {
			noLog || console.log(`HttpUtil download ${url}.`);

			let params = this.packParams(url, "GET", sendData, "blob");

			let startTime = Date.now();
			this._request(params).then(
				(result: { status: number, data: any }) => {
					try {
						if (!noLog) {
							let duration = Date.now() - startTime;
							console.log(`HttpUtil download succeed [cost:${duration}ms] ${url}`);
						}
						resolve(window["Blob"] ? new Blob([result.data]) : result.data);
					} catch (e) {
						console.error(e);
					}
				},
				(reason: { status: number, message: string }) => {
					try {
						let duration = Date.now() - startTime;
						console.error(`HttpUtil download failed [cost:${duration}ms] ${url}:`, reason.message);
						reject(reason.message);
					} catch (e) {
						console.error(e);
					}
				}
			);
		});
	}

	private static packParams(url: string, method: string, sendData: Object | string | FormData, responseType: XMLHttpRequestResponseType, headers?: { [key: string]: string }, timeout?: number): HttpRequestParams {
		let params: HttpRequestParams = {url, method, body: null};
		params.responseType = responseType;
		params.headers = headers || {};
		timeout && (params.timeout = timeout);

		let sType = method.toUpperCase();
		let isUseUrlParam = sType === "GET" || sType === "DELETE";
		if (isUseUrlParam) {
			if (sendData) {	// 如果是"简单"请求,则把data参数组装在url上
				let paramsStr = sendData instanceof Object ? HttpUtil.toQueryString(sendData) : sendData;
				params.url += params.url.indexOf("?") !== -1 ? "&" + paramsStr : "?" + paramsStr;
			}
		} else {
			if (typeof sendData === "string" || (window["FormData"] && sendData instanceof FormData)) {
				params.body = sendData;
			} else if (sendData) {
				if (params.headers["Content-Type"].startsWith("application/json")) {
					params.body = JSON.stringify(sendData);
				} else {
					params.body = HttpUtil.toQueryString(sendData);
				}
			}
		}
		return params;
	}

	private static _request(requestParams: HttpRequestParams): Promise<{ status: number, data: any }> {
		return new Promise<{ status: number, data: any }>((resolve, reject) => {
			let params: HttpRequestParams = Object.assign({
				responseType: "", async: true, headers: {}, timeout: 10000
			}, requestParams || {});
			params.method || (params.method = "GET");
			if (!params.url) {
				reject({message: "HttpUtil request url is empty!"});
				return;
			}

			let request = new XMLHttpRequest();
			request.onload = () => {
				const status = request.status;
				if ((status >= 200 && status < 300) || status === 304) {
					let data: any;
					if (request.responseType === "text" || request.responseType === "") {
						data = request.responseText;
					} else if (request.responseType === "document") {
						data = request.responseXML;
					} else {
						data = request.response;
					}
					resolve && resolve({status, data});
				} else {
					reject({status, message: `[${request.status}]${request.statusText}:${request.responseURL}`})
				}
			};
			request.onerror = () => {
				reject({
					status: request.status,
					message: `HttpUtil request failed! [${request.status}]:${request.statusText}`
				});
			};
			request.onabort = () => {
				reject({status: request.status, message: "HttpUtil request was aborted by user."});
			};
			request.ontimeout = () => {
				reject({status: 408, message: "HttpUtil request timeout."});
			};

			request.open(params.method, params.url, params.async);

			request.responseType = params.responseType;
			for (let key in params.headers) {
				if (params.headers.hasOwnProperty(key)) {
					request.setRequestHeader(key, params.headers[key]);
				}
			}
			if (params.async && params.timeout) {
				request.timeout = params.timeout;
			}

			request.send(params.body);
		});
	}

	public static toQueryString(data: any): string {
		let paramsArray: string[] = [];
		if (data != null && data instanceof Object) {
			for (let key in data) {
				if (data.hasOwnProperty(key)) {
					let value = data[key];
					if (value !== undefined) {
						let valueJsonStr = typeof value === "string" ? value : JSON.stringify(value);
						paramsArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(valueJsonStr));
					}
				}
			}
		}
		return paramsArray.join("&");
	}
}