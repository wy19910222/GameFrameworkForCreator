/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

@jsClass
export abstract class BaseModel extends cc.Component {
	public get isModel(): boolean {
		return true;
	}
}