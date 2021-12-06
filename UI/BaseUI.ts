/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

import {CoroutineManager} from "../Manager/CoroutineManager";
import {EventManager} from "../Manager/EventManager";
import {UIManager} from "../Manager/UIManager";

export enum UIType {
	Scene,	// 场景界面
	ScenePart,	// 从场景界面里拆出来的一部分，视觉上属于场景界面，为了复用和便于修改而拆出来
	Window,	// 普通窗口界面
	Dialog,		// 阻塞流程，强制用户操作，如模态对话框
	Temporary,	// 不可穿透，阻塞背后界面的操作，但能自动消失，如加载中、网络连接中
	Transparent,	// 可穿透，不需要主动关闭，不阻塞背后界面的操作，如Toast、Banner广告的叉叉等
}

/**
 * UIManager.open ……[EndOfFrame]…… start
 * ├─── setView
 * ├─── onLoad
 * └─── AsyncBox.then
 */
@jsClass
export abstract class BaseUI extends cc.Component {
	protected _view: fgui.GComponent;
	public get view(): fgui.GComponent {
		return this._view;
	}

	public setView(view: fgui.GComponent, ...args: any[]): void {
		this._view = view;
	}

	// private _eventHandlerList: EventHandler[] = [];
	//
	// /**
	//  * 通过本函数设置的监听，在enable为false时不响应事件
	//  */
	// protected on(type: string, caller: any, listener: Function, argArray?: any[], insertFirst?: boolean): void {
	// 	let handler = EventManager.instance.on(type, caller, listener, argArray, insertFirst);
	// 	insertFirst ? this._eventHandlerList.unshift(handler) : this._eventHandlerList.push(handler);
	// }
	//
	// protected onEnable(): void {
	// 	this._eventHandlerList.forEach(eventHandler => eventHandler.enabled = true);
	// }
	//
	// protected onDisable(): void {
	// 	this._eventHandlerList.forEach(eventHandler => eventHandler.enabled = false);
	// }

	protected onDestroy(): void {
		console.log("onDestroy: " + cc.js.getClassName(this));

		// this._eventHandlerList = null;
		EventManager.instance.offAll(this);
		CoroutineManager.instance.stopAllCo(this);
		UIManager.instance.removeTopCollider(this);

		this.view.dispose();
		let uiClass = <typeof BaseUI>this.constructor;
		uiClass.willClearOnDestroy && UIManager.instance.clearPkgResByClass(uiClass);
	}

	/**
	 * If return true, atlas will be cleared while ui being destroyed.
	 */
	public static get willClearOnDestroy(): boolean {
		return true;
	}

	//#region Override if need to set package with specific feature
	/**
	 * Sorting order of main component
	 */
	public static get sortingOrder(): number {
		return 0;
	}

	/**
	 * Will show loading or not while opening ui
	 */
	public static get willShowLoading(): boolean {
		return true;
	}

	/**
	 * Classify ui to determine whether close it or not.
	 */
	public static get uiType(): UIType {
		return UIType.Scene;
	}

	//#endregion

	//#region Override is not necessary
	public static uiBind(): void {
		let extPkgNames = this.getExtPkgNames();
		for (const extPkgName of extPkgNames) {
			try {
				let binder: { default: { bindAll: () => void } } = require(extPkgName + "Binder");
				binder && binder.default.bindAll();
			} catch (e) {
				console.warn(`${extPkgName} bind failed:`, e);
			}
		}
		let pkgName = this.getPkgName();
		try {
			let binder: { default: { bindAll: () => void } } = require(pkgName + "Binder");
			if (binder) {
				binder.default.bindAll();
			} else {
				console.warn(`${pkgName} has no binder.`);
			}
		} catch (e) {
			console.warn(`${pkgName} bind failed:`, e);
		}
	}

	//#endregion

	//#region Override if need to load package with different name
	/**
	 * Name of package
	 */
	public static getPkgName(): string {
		return cc.js.getClassName(this);
	}

	/**
	 * Name of main component
	 */
	public static getCompName(): string {
		return "View";
	}

	//#endregion

	//#region Override if need to load others package
	/**
	 * Override method like this:
	 *  public static getExtPkgNames(): string[] {
	 *  	return [
	 *  		"XXX1",
	 *  		"XXX2"
	 *  	];
	 *  }
	 */
	public static getExtPkgNames(): string[] {
		return [];
	}

	//#endregion
}
