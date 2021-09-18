/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

import {BaseRoot, Root} from "./BaseRoot";
import {ManagerRoot} from "./ManagerRoot";
import {ModelRoot} from "./ModelRoot";
import {ProxyRoot} from "./ProxyRoot";

@jsClass
export class GameRoot extends Root<BaseRoot> {
	private static sGameMain: GameRoot;

	public static get instance(): GameRoot {
		return this.sGameMain;
	}

	protected onAwake(): void {
		GameRoot.sGameMain = this;
		this.add(ManagerRoot);
		this.add(ModelRoot);
		this.add(ProxyRoot);
	}
}