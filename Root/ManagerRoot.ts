/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

import {Root} from "./BaseRoot";
import {GameRoot} from "./GameRoot";
import {BaseManager} from "../Manager/BaseManager";

import {CoroutineManager} from "../Manager/CoroutineManager";
import {EventManager} from "../Manager/EventManager";
import {UIManager} from "../Manager/UIManager";
import {AudioManager} from "../Manager/AudioManager";

@jsClass
export class ManagerRoot extends Root<BaseManager> {
	public static get instance(): ManagerRoot {
		return GameRoot.instance.get(this);
	}

	protected onLoad(): void {
		this.add(CoroutineManager);
		this.add(EventManager);
		this.add(UIManager);
		this.add(AudioManager);
	}
}