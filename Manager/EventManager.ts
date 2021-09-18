/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

import {BaseManager} from "./BaseManager";
import {ManagerRoot} from "../Root/ManagerRoot";

@jsClass("EventHandler")
export class EventHandler {
	private readonly _listener: Function;
	public get listener(): Function {
		return this._listener;
	}

	private readonly _argArray: any[];
	public get argArray(): any[] {
		return this._argArray;
	}

	private readonly _isOnce: boolean;
	public get isOnce(): boolean {
		return this._isOnce;
	}

	private _enabled = true;
	public get enabled(): boolean {
		return this._enabled;
	}
	public set enabled(value: boolean) {
		this._enabled = value;
	}

	constructor(listener: Function, argArray: any[], isOnce: boolean = false) {
		this._listener = listener;
		this._argArray = argArray;
		this._isOnce = isOnce;
	}
}

@jsClass
export class EventManager extends BaseManager {
	public static get instance(): EventManager {
		return ManagerRoot.instance.get(this);
	}

	private _typeCallerMap = new Map<string, Map<any, EventHandler[]>>();

	public has(type: string, caller: any, listener: Function): boolean {
		return this.isValidParams(type, caller, listener) && this.find(type, caller, listener) !== null;
	}

	public noLogEmit(type: string, ...argArray: any[]): boolean {
		return this._emit(type, argArray, false);
	}
	public emit(type: string, ...argArray: any[]): boolean {
		return this._emit(type, argArray, true);
	}
	private _emit(type: string, argArray: any[], logEvent: boolean): boolean {
		if (!type) {
			console.error("Event type is null!");
			return false;
		}
		logEvent && console.log("trigger " + type + (argArray.length > 0 ? ": " : "."), ...argArray);
		let handlerList: EventHandler[] = [];
		let callerList: any[] = [];
		let callerHandlersMap = this._typeCallerMap.get(type);
		if (callerHandlersMap) {
			for (let [caller, handlers] of callerHandlersMap) {
				for (let handler of handlers) {
					handlerList.push(handler);
					callerList.push(caller);
				}
				for (let index = handlers.length - 1; index >= 0; --index) {
					if (handlers[index].isOnce) {
						handlers.splice(index, 1);
					}
				}
				if (handlers.length <= 0) {
					callerHandlersMap.delete(caller);
				}
			}
			if (callerHandlersMap.size <= 0) {
				this._typeCallerMap.delete(type);
			}
		}
		let length = handlerList.length;
		for (let index = 0; index < length; ++index) {
			let handler = handlerList[index];
			if (handler.enabled) {
				try {
					handler.listener.call(callerList[index], ...handler.argArray || [], ...argArray);
				} catch (e) {
					let stack = e.stack.split("at ").splice(1).map(str => {
						let temp = str.split(/\s+/);
						temp.splice(temp.length - 2);
						return temp.join(" ");
					}).join(";");
					let args = JSON.stringify(argArray);
					cc.systemEvent.emit("CatchError", {type: "EventEmit", eventType: type, error: e, stack, args});
					console.error(e);
				}
			}
		}
		return length > 0;
	}

	public on(type: string, caller: any, listener: Function, argArray?: any[], insertFirst?: boolean): EventHandler {
		return this.addListener(type, caller, listener, false, argArray, insertFirst);
	}

	public once(type: string, caller: any, listener: Function, argArray?: any[], insertFirst?: boolean): EventHandler {
		return this.addListener(type, caller, listener, true, argArray, insertFirst);
	}

	public off(type: string, caller: any, listener: Function, onceOnly?: boolean): void {
		this.removeBy((eventType, listenerCaller, handler) => {
			if (type && type !== eventType) {
				return false;
			}
			if (caller && caller !== listenerCaller) {
				return false;
			}
			if (listener && listener !== handler.listener) {
				return false;
			}
			if (onceOnly && !handler.isOnce) {
				return false;
			}
			return true;
		});
	}

	public offAll(caller: any): void {
		let types: string[] = [];
		for (let [type, callerHandlersMap] of this._typeCallerMap) {
			callerHandlersMap.delete(caller);
			if (callerHandlersMap.size <= 0) {
				types.push(type);
			}
		}
		for (let type of types) {
			this._typeCallerMap.delete(type);
		}
	}

	private addListener(type: string, caller: any, listener: Function, isOnce: boolean, argArray: any[], insertFirst: boolean): EventHandler {
		if (!this.isValidParams(type, caller, listener)) {
			return null;
		}

		let handler = this.find(type, caller, listener);
		if (handler) {
			console.error("Listener is already exist!", type);
		} else {
			handler = new EventHandler(listener, argArray, isOnce);
			let handlers = this._typeCallerMap.get(type).get(caller);
			insertFirst ? handlers.unshift(handler) : handlers.push(handler);
		}
		return handler;
	}

	private removeBy(predicate: (type: string, caller: any, handler: EventHandler) => boolean): void {
		if (!predicate) {
			return;
		}
		for (let [type, callerHandlersMap] of this._typeCallerMap) {
			for (let [caller, handlers] of callerHandlersMap) {
				for (let index = handlers.length - 1; index >= 0; --index) {
					let handler = handlers[index];
					if (predicate(type, caller, handler)) {
						handlers.splice(index, 1);
					}
				}
				if (handlers.length <= 0) {
					callerHandlersMap.delete(caller);
				}
			}
			if (callerHandlersMap.size <= 0) {
				this._typeCallerMap.delete(type);
			}
		}
	}

	private find(type: string, caller: any, listener: Function): EventHandler {
		let callerHandlersMap: Map<any, EventHandler[]>;
		if (this._typeCallerMap.has(type)) {
			callerHandlersMap = this._typeCallerMap.get(type);
		} else {
			callerHandlersMap = new Map<any, EventHandler[]>();
			this._typeCallerMap.set(type, callerHandlersMap);
		}
		let handlers: EventHandler[];
		if (callerHandlersMap.has(caller)) {
			handlers = callerHandlersMap.get(caller);
		} else {
			handlers = [];
			callerHandlersMap.set(caller, handlers);
		}

		for (let handler of handlers) {
			if (handler.listener === listener) {
				return handler;
			}
		}
		return null;
	}

	private isValidParams(type: string, caller: any, listener: Function): boolean {
		if (!type) {
			console.error("Event type is null!");
			return false;
		}
		if (!caller) {
			console.error("Caller is null!");
			return false;
		}
		if (!listener) {
			console.error("Listener is null!");
			return false;
		}
		return true;
	}
}