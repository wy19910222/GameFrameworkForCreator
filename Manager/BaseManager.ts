/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

/**
 * 不要在Manager的onLoad中引用别的Manager
 */
@jsClass
export abstract class BaseManager extends cc.Component {
	public get isManager(): boolean {
		return true;
	}
}