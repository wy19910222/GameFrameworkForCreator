/**
 * 为component新增onAwake函数：当component附加到一个节点上时调用。onAwake 总是会在任何 onLoad 方法调用前执行，这能用于安排脚本的初始化顺序。<br/>
 * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
 */

var Destroying = cc.Object.Flags.Destroying;
var js = cc.js;
cc._BaseNode.prototype.addComponent = function (typeOrClassName) {
	if (CC_EDITOR && (this._objFlags & Destroying)) {
		cc.error('isDestroying');
		return null;
	}

	// get component

	var constructor;
	if (typeof typeOrClassName === 'string') {
		constructor = js.getClassByName(typeOrClassName);
		if (!constructor) {
			cc.errorID(3807, typeOrClassName);
			if (cc._RFpeek()) {
				cc.errorID(3808, typeOrClassName);
			}
			return null;
		}
	}
	else {
		if (!typeOrClassName) {
			cc.errorID(3804);
			return null;
		}
		constructor = typeOrClassName;
	}

	// check component

	if (typeof constructor !== 'function') {
		cc.errorID(3809);
		return null;
	}
	if (!js.isChildClassOf(constructor, cc.Component)) {
		cc.errorID(3810);
		return null;
	}

	if ((CC_EDITOR || CC_PREVIEW) && constructor._disallowMultiple) {
		if (!this._checkMultipleComp(constructor)) {
			return null;
		}
	}

	// check requirement

	var ReqComp = constructor._requireComponent;
	if (ReqComp && !this.getComponent(ReqComp)) {
		var depended = this.addComponent(ReqComp);
		if (!depended) {
			// depend conflicts
			return null;
		}
	}

	//// check conflict
	//
	//if (CC_EDITOR && !_Scene.DetectConflict.beforeAddComponent(this, constructor)) {
	//    return null;
	//}

	//

	var component = new constructor();
	component.node = this;
	this._components.push(component);
	if ((CC_EDITOR || CC_TEST) && cc.engine && (this._id in cc.engine.attachedObjsForEditor)) {
		cc.engine.attachedObjsForEditor[component._id] = component;
	}
	component.onAwake && component.onAwake();	// add
	if (this._activeInHierarchy) {
		cc.director._nodeActivator.activateComp(component);
	}

	return component;
};