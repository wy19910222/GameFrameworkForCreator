/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

import {BaseUI, UIType} from "./BaseUI";
import {UIClass, UIManager} from "../Manager/UIManager";
import { AsyncBox } from "../Utils/AsyncBox";

/**
 * UIManager.open ……[LateOfFrame]…… start
 * ├─── setView
 * │    └─── fadeIn ……[FadeDuration]…… onFadedIn
 * ├─── onLoad
 * └─── AsyncBox.then
 *
 * onExitClick
 * ├─── onExit
 * ├─── _onExit
 * └─── fadeOut ……[FadeDuration]…… onFadedOut
 *                                 └─── UIManager.close ……[EndOfFrame]…… onDestroy
 *                                                                       ├─── onExit (If it hasn't been called)
 *                                                                       ├─── _onExit (If it hasn't been called)
 *                                                                       ├─── _onDispose
 *                                                                       └─── super.onDestroy (EventManager.offAll、CoroutineManager.stopAll)
 */
@jsClass
export abstract class FadeUI extends BaseUI {
	public static get uiType(): UIType {
		return UIType.Window;
	}

	protected _onExit: () => void;
	protected _onDestroy: () => void;

	public setView(view: fgui.GComponent, onExit?: () => void, onDestroy?: () => void): void {
		super.setView(view);
		this.onSetView(onExit, onDestroy);
	}

	protected onSetView(onExit?: () => void, onDestroy?: () => void): void {
		this._onExit = onExit;
		this._onDestroy = onDestroy;
		// value.node.opacity = 0;
		// CoroutineManager.instance.EndOfLag(() => {
		// 	value.node.opacity = 255;
		// 	this.fadeIn();
		// }, this);
		this.fadeIn();
	}

	private _tFadeIn: fgui.Transition;
	protected fadeIn(): void {
		this._tFadeIn = this.fade("TFadeIn", () => {
			this._tFadeIn = null;
			this.onFadedIn();
		});
	}

	protected onFadedIn(): void {
	}

	protected _exitClicked: boolean;
	public get exitClicked(): boolean {
		return this._exitClicked;
	}
	protected onExitClick(): void {
		if (!this._exitClicked && cc.isValid(this)) {
			this._exitClicked = true;
			for (let index = 0, length = this.view.numChildren; index < length; ++index) {
				this.view.getChildAt(index).touchable = false;
			}
			this.onExit();
			this._onExit && this._onExit();
			this.fadeOut();
		}
	}

	protected onExit(): void {
	}

	protected fadeOut(): void {
		if (this._tFadeIn) {
			this._tFadeIn.stop();
			this.onFadedIn();
		}
		this.fade("TFadeOut", this.onFadedOut.bind(this));
	}

	protected onFadedOut(): void {
		UIManager.instance.close(this);
	}

	protected onDestroy(): void {
		if (!this._exitClicked) {
			this.onExit();
			this._onExit && this._onExit();
		}
		this._onDestroy && this._onDestroy();
		super.onDestroy();
	}

	private fade(name: string, callback: () => void): fgui.Transition {
		let fade = this.view.getTransition(name);
		if (fade) {
			fade.play(callback);
		} else {
			callback();
		}
		return fade;
	}
}
