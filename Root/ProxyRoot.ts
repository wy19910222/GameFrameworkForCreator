/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

import {Root} from "./BaseRoot";
import {GameRoot} from "./GameRoot";
import {BaseProxy} from "../Proxy/BaseProxy";

@jsClass
export class ProxyRoot extends Root<BaseProxy> {
	public static get instance() {
		return GameRoot.instance.get(this);
	}
}