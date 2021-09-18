/**
 * @auth wangyun
 * @date 2020/12/10-14:04
 */

let tweenTo = cc.Tween.prototype.to;
cc.Tween.prototype.to = function (duration, props, opts) {
	return tweenTo.call(this, duration, Object.trim(props), opts);
};

let tweenBy = cc.Tween.prototype.by;
cc.Tween.prototype.by = function (duration, props, opts) {
	return tweenBy.call(this, duration, Object.trim(props), opts);
};