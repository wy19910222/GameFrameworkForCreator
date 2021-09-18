/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

@jsClass
export abstract class BaseProxy extends cc.Component {
	public get isProxy(): boolean {
		return true;
	}
}