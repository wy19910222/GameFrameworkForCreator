/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

import {Root} from "./BaseRoot";
import {GameRoot} from "./GameRoot";
import {BaseModel} from "../Model/BaseModel";

@jsClass
export class ModelRoot extends Root<BaseModel> {
	public static get instance() {
		return GameRoot.instance.get(this);
	}
}