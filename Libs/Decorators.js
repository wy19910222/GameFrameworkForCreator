/**
 * @auth wangyun
 * @date 2020/10/30-16:55
 */

window["jsClass"] = function (target) {
    if (typeof target === "string") {
        return ctor => decorate(ctor, target);
    } else {
        return decorate(target);
    }
};
function decorate(ctor, name) {
    if (cc.Component.isPrototypeOf(ctor)) {
        if (name) {
            return cc._decorator.ccclass(name)(ctor);
        } else {
            return cc._decorator.ccclass(ctor);
        }
    } else {
        name || (name = cc._RF.peek().script);
        return cc.js.setClassName(name, ctor);
    }
}

window["globalClass"] = function (target) {
    if (typeof target === "string") {
        return ctor => globalDecorate(ctor, target);
    } else {
        return globalDecorate(target);
    }
};
function globalDecorate(ctor, name) {
    name || (name = cc._RF.peek().script);
    window[name] = ctor;
}