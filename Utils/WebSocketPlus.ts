/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

export interface PacketInfo {
	requestId: number,
	routeId: number,
	body: ArrayBufferLike
}

// @jsClass
export class WebSocketPlus {
	private readonly MAX_REQUEST_ID = 0x7FFFFFFF;
	private _requestId = 0;	// 0x00000001-0x7FFFFFFF
	private _socket: WebSocket;
	private _callbacks: {[requestId: number]: (routeId: number, data: ArrayBufferLike) => void} = {};

	private _onMessage: (routeId: number, data: ArrayBufferLike) => void;
	public onMessage(onMessage: (routeId: number, data: ArrayBufferLike) => void): void {
		this._onMessage = onMessage;
	}
	private _onClose: (event: Event) => void;
	public onClose(onClose: (event: Event) => void): void {
		this._onClose = onClose;
	}
	private _onError: (error: Event) => void;
	public onError(onError: (error: Event) => void): void {
		this._onError = onError;
	}

	public connect(url: string, callback: () => void, error?: () => void): void {
		let ws = new WebSocket(url);
		ws.binaryType = "arraybuffer";
		ws.onopen = () => {
			error = null;
			if (callback) {
				try {
					callback();
				} catch (e) {
					console.error(e);
				}
			}
		};
		ws.onmessage = event => {
			this.processPackage(event.data);
		};
		ws.onclose = event => {
			if (this._onClose) {
				try {
					this._onClose(event);
				} catch (e) {
					console.error(e);
				}
			}
		};
		ws.onerror = event => {
			if (error) {
				try {
					error();
				} catch (e) {
					console.error(e);
				}
			}
			if (this._onError) {
				try {
					this._onError(event);
				} catch (e) {
					console.error(e);
				}
			}
		};
		this._socket = ws;
	}
	public disconnect(): void {
		if (this._socket) {
			this._socket.close();
			this._socket = null;
		}
		this._callbacks = {};
	}

	public request(routeId: number, msgBuffer: ArrayBufferLike, callback?: (routeId: number, data: ArrayBufferLike) => void): void {
		if (routeId) {
			this._requestId = this._requestId === this.MAX_REQUEST_ID ? 1 : this._requestId + 1;
			this.sendMessage(this._requestId, routeId, msgBuffer);
			this._callbacks[this._requestId] = callback;
		}
	}
	public notify(routeId: number, msgBuffer: ArrayBufferLike): void {
		this.sendMessage(0, routeId, msgBuffer);
	}
	private sendMessage(requestId: number, routeId: number, body: ArrayBufferLike): void {
		let packetBytes = this.encode({requestId, routeId, body});
		packetBytes && this._socket.send(packetBytes);
	}

	private processPackage(packetBuffer: ArrayBufferLike) {
		let packetInfo = this.decode(packetBuffer);
		packetInfo && this.processMessage(packetInfo);
	}
	private processMessage(packetInfo: PacketInfo) {
		if (packetInfo.requestId) {
			let callback = this._callbacks[packetInfo.requestId];
			delete this._callbacks[packetInfo.requestId];
			if (callback) {
				try {
					callback(packetInfo.routeId, packetInfo.body);
				} catch (e) {
					console.error(e);
				}
			}
		} else {
			if (this._onMessage) {
				try {
					this._onMessage(packetInfo.routeId, packetInfo.body);
				} catch (e) {
					console.error(e, e.stack);
				}
			}
		}
	}

	public decode(packetBuffer: ArrayBufferLike): PacketInfo {
		let packetBytes = new Uint8Array(packetBuffer);
		let packetLength = packetBytes.byteLength;
		let headLength = 4 + 4 + 4;
		if (packetLength >= headLength) {
			let totalLength = packetBytes[0] | packetBytes[1] << 8 | packetBytes[2] << 16 | packetBytes[3] << 24;
			let requestId = packetBytes[4] | packetBytes[5] << 8 | packetBytes[6] << 16 | packetBytes[7] << 24;
			let routeId = packetBytes[8] | packetBytes[9] << 8 | packetBytes[10] << 16 | packetBytes[11] << 24;
			let body = packetBytes.slice(12, totalLength);
			return {requestId, routeId, body};
		}
		return null;
	}
	public encode(data: PacketInfo): ArrayBufferLike {
		if (!data || !data.routeId) {
			return null;
		}
		let {requestId, routeId, body} = data;

		let bodyBytes = body && new Uint8Array(body);
		let bodyLength = bodyBytes ? bodyBytes.byteLength : 0;
		let headLength = 4 + 4 + 4;
		let totalLength = headLength + bodyLength;
		let packetBytes = new Uint8Array(totalLength);

		packetBytes[0] = totalLength & 0xff;
		packetBytes[1] = totalLength >> 8 & 0xff;
		packetBytes[2] = totalLength >> 16 & 0xff;
		packetBytes[3] = totalLength >> 24 & 0xff;

		packetBytes[4] = requestId & 0xff;
		packetBytes[5] = requestId >> 8 & 0xff;
		packetBytes[6] = requestId >> 16 & 0xff;
		packetBytes[7] = requestId >> 24 & 0xff;

		packetBytes[8] = routeId & 0xff;
		packetBytes[9] = routeId >> 8 & 0xff;
		packetBytes[10] = routeId >> 16 & 0xff;
		packetBytes[11] = routeId >> 24 & 0xff;

		if (bodyLength > 0) {
			packetBytes.set(bodyBytes, headLength);
		}

		return packetBytes.buffer;
	}
}