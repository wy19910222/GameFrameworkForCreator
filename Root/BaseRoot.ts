/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

@jsClass
export class BaseRoot extends cc.Component { }

export abstract class Root<E extends cc.Component> extends BaseRoot {
	private _elementId = 1;
	private _object: { [key: string]: E } = {};

	public add<T extends E>(ElementClass: { new (): T, $_CEID?: string }): void {
		ElementClass.$_CEID || (ElementClass.$_CEID = this._elementId++ + "");
		let node = new cc.Node();
		node.setParent(this.node);
		this._object[ElementClass.$_CEID] = node.addComponent(ElementClass);
	}

	public get<T extends E>(ElementClass: { new (): T, $_CEID?: string }): T {
		let elementId = ElementClass.$_CEID;
		return elementId ? <T>this._object[elementId] : null;
	}

	public forEach(callbackFunc: (element: E, elementId: string) => void): void {
		if (callbackFunc) {
			for (let id in this._object) {
				if (this._object.hasOwnProperty(id)) {
					let element = this._object[id];
					callbackFunc(element, id);
				}
			}
		}
	}
}