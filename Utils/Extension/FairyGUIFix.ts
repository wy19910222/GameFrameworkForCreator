/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

fgui.GLoader.prototype["loadExternal"] = function () {
	var _this = this;
	var url = this.url;
	var callback = function (err, asset) {
		if (_this._url != url || !cc.isValid(_this._node))
			return;
		if (err)
			console.warn(err);
		if (asset instanceof cc.SpriteFrame)
			_this.onExternalLoadSuccess(asset);
		else if (asset instanceof cc.Texture2D)
			_this.onExternalLoadSuccess(new cc.SpriteFrame(asset));
	};
	if (fgui.ToolSet.startsWith(this._url, "http://")
		|| fgui.ToolSet.startsWith(this._url, "https://")
		|| fgui.ToolSet.startsWith(this._url, '/'))
		//#region modify 修复装载器不能装在无扩展名的远端图片url
		if (cc.assetManager.assets.has(this._url)) {
			let asset = cc.assetManager.assets.get(this._url);
			asset instanceof cc.Asset && asset.addRef();
			requestAnimationFrame(() => {
				asset instanceof cc.Asset && asset.decRef.call(asset, false);
				callback(null, asset);
			});
		} else {
			cc.assetManager.loadRemote(this._url, {ext: ".png"}, callback);
		}
		//#endregion
	else
		cc.resources.load(this._url, cc.Asset, callback);
};

fgui.GLoader.prototype["updateLayout"] = function () {
	if (this._content2 == null && this._content == null) {
		if (this._autoSize) {
			this._updatingLayout = true;
			this.setSize(50, 30);
			this._updatingLayout = false;
		}
		return;
	}
	var cw = this.sourceWidth;
	var ch = this.sourceHeight;
	//#region modify 修复装载器对齐方式不对问题
	var pivotCorrectX;
	var pivotCorrectY;
	//#endregion
	if (this._autoSize) {
		this._updatingLayout = true;
		if (cw == 0)
			cw = 50;
		if (ch == 0)
			ch = 30;
		this.setSize(cw, ch);
		this._updatingLayout = false;
		this._container.setContentSize(this._width, this._height);
		//#region add 修复装载器对齐方式不对问题
		pivotCorrectX = -this.pivotX * this._width;
		pivotCorrectY = this.pivotY * this._height;
		//#endregion
		this._container.setPosition(pivotCorrectX, pivotCorrectY);
		if (this._content2) {
			this._content2.setPosition(pivotCorrectX + this._width * this.pivotX, pivotCorrectY - this._height * this.pivotY);
			this._content2.setScale(1, 1);
		}
		if (cw == this._width && ch == this._height)
			return;
	}
	var sx = 1, sy = 1;
	if (this._fill != fgui.LoaderFillType.None) {
		sx = this.width / this.sourceWidth;
		sy = this.height / this.sourceHeight;
		if (sx != 1 || sy != 1) {
			if (this._fill == fgui.LoaderFillType.ScaleMatchHeight)
				sx = sy;
			else if (this._fill == fgui.LoaderFillType.ScaleMatchWidth)
				sy = sx;
			else if (this._fill == fgui.LoaderFillType.Scale) {
				if (sx > sy)
					sx = sy;
				else
					sy = sx;
			}
			else if (this._fill == fgui.LoaderFillType.ScaleNoBorder) {
				if (sx > sy)
					sy = sx;
				else
					sx = sy;
			}
			if (this._shrinkOnly) {
				if (sx > 1)
					sx = 1;
				if (sy > 1)
					sy = 1;
			}
			cw = this.sourceWidth * sx;
			ch = this.sourceHeight * sy;
		}
	}
	this._container.setContentSize(cw, ch);
	//#region add 修复装载器对齐方式不对问题
	pivotCorrectX = -this.pivotX * this._width;
	pivotCorrectY = this.pivotY * this._height;
	//#endregion
	if (this._content2) {
		this._content2.setPosition(pivotCorrectX + this._width * this.pivotX, pivotCorrectY - this._height * this.pivotY);
		this._content2.setScale(sx, sy);
	}
	var nx, ny;
	if (this._align == fgui.AlignType.Left)
		nx = 0;
	else if (this._align == fgui.AlignType.Center)
		nx = Math.floor((this._width - cw) / 2);
	else
		nx = this._width - cw;
	if (this._verticalAlign == fgui.VertAlignType.Top)
		ny = 0;
	else if (this._verticalAlign == fgui.VertAlignType.Middle)
		ny = Math.floor((this._height - ch) / 2);
	else
		ny = this._height - ch;
	ny = -ny;
	this._container.setPosition(pivotCorrectX + nx, pivotCorrectY + ny);
};

//#region add 修复图形透明度不能渐变问题
Object.defineProperty(fgui.GGraph.prototype, "alpha", {
	get: function () {
		return this._alpha;
	},
	set: function (value) {
		if (this._alpha !== value) {
			this._alpha = value;
			this._node.opacity = this._alpha * 255;
			this.updateGraph();
			this.updateGear(3);
		}
	},
	enumerable: true,
	configurable: true
});
//#endregion
let updateGraph = fgui.GGraph.prototype["updateGraph"];
fgui.GGraph.prototype["updateGraph"] = function () {
	//#region add 修复图形透明度不能渐变问题
	let lineColor = this._lineColor;
	let fillColor = this._fillColor;
	this._lineColor = lineColor.clone();
	this._lineColor.setA(lineColor.getA() * this._alpha);
	this._fillColor = fillColor.clone();
	this._fillColor.setA(fillColor.getA() * this._alpha);
	//#endregion

	updateGraph.call(this);

	//#region add 修复图形透明度不能渐变问题
	this._lineColor = lineColor;
	this._fillColor = fillColor;
	//#endregion
};

fgui.GButton.prototype["onClick_1"] = function () {
	if (this._sound) {
		let pi = fgui.UIPackage.getItemByURL(this._sound);
		if (pi) {
			let sound = <cc.AudioClip>pi.owner.getItemAsset(pi);
			if (sound)
				fgui.GRoot.inst.playOneShotSound(sound, this._soundVolumeScale);
		}
		//#region add 修复按钮点击音效不能使用FairyGUI工程外的音频的问题
		else {
			let sound: cc.AudioClip = cc.resources.get(this._sound, cc.AudioClip);
			if (sound) {
				fgui.GRoot.inst.playOneShotSound(sound, this._soundVolumeScale);
			} else {
				cc.resources.load(this._sound, cc.AudioClip, (error, sound: cc.AudioClip) => {
					if (!error) {
						fgui.GRoot.inst.playOneShotSound(sound, this._soundVolumeScale);
					}
				});
			}
		}
		//#endregion
	}
	if (this._mode === fgui.ButtonMode.Check) {
		if (this._changeStateOnClick) {
			this.selected = !this._selected;
			this._node.emit(fgui.Event.STATUS_CHANGED, this);
		}
	}
	else if (this._mode === fgui.ButtonMode.Radio) {
		if (this._changeStateOnClick && !this._selected) {
			this.selected = true;
			this._node.emit(fgui.Event.STATUS_CHANGED, this);
		}
	}
	else {
		if (this._relatedController)
			this._relatedController.selectedPageId = this._relatedPageId;
	}
};

fgui.GObject.prototype.setSkew = function (xv, yv) {
	if (this._skewX != xv || this._skewY != yv) {
		this._skewX = xv;
		this._skewY = yv;
		this._node.skewX = xv;
		//#region modify 修复倾斜y方向反了的问题
		this._node.skewY = -yv;	// modify
		//#endregion
	}
};

//#region add 修复进度条在缓动过程中销毁会报错问题
let dispose = fgui.GProgressBar.prototype.dispose;
fgui.GProgressBar.prototype.dispose = function () {
	fgui.GTween.kill(this, false, this.update);
	dispose.call(this);
};
//#endregion

fgui.GTextField.prototype["handleGrayedChanged"] = function () {
	this.updateFontColor();
	this.updateStrokeColor();
	//#region add 修复文本框不能变灰的问题
	let material;
	if (this._grayed) {
		if (!this._graySpriteMaterial) {
			this._graySpriteMaterial = cc.MaterialVariant.create(cc.Material.getBuiltinMaterial('2d-gray-sprite'), this._label);
		}
		material = this._graySpriteMaterial;
	}
	else {
		if (!this._spriteMaterial) {
			this._spriteMaterial = cc.MaterialVariant.create(cc.Material.getBuiltinMaterial('2d-sprite'), this._label);
		}
		material = this._spriteMaterial;
	}
	this._label.setMaterial(0, material);
	//#endregion
};

fgui.GTextField.prototype["updateFontSize"] = function () {
	var font = this._label.font;
	if (font instanceof cc.BitmapFont) {
		// @ts-ignore
		var fntConfig = font._fntConfig;
		if (fntConfig.resizable)
			this._label.fontSize = this._fontSize;
		else
			this._label.fontSize = fntConfig.fontSize;
		//#region modify 修复图集字体非原字号行距不对问题
		this._label.lineHeight = this._label.fontSize + this._leading;
		//#endregion
	}
	else {
		this._label.fontSize = this._fontSize;
		this._label.lineHeight = this._fontSize + this._leading;
	}
};

Object.defineProperty(fgui.Image.prototype, "grayed", {
	get: function () {
		return this._grayed;
	},
	set: function (value) {
		if (this._grayed == value)
			return;
		this._grayed = value;
		let material;
		if (value) {
			//#region modify 修复图片每次变灰都创建MaterialVariant问题
			if (!this._graySpriteMaterial) {
				this._graySpriteMaterial = cc.MaterialVariant.create(cc.Material.getBuiltinMaterial('2d-gray-sprite'), this);
			}
			material = this._graySpriteMaterial;
			//#endregion
		}
		else {
			//#region modify 修复图片每次变灰都创建MaterialVariant问题
			if (!this._spriteMaterial) {
				this._spriteMaterial = cc.MaterialVariant.create(cc.Material.getBuiltinMaterial('2d-sprite'), this);
			}
			material = this._spriteMaterial;
			//#endregion
		}
		this.setMaterial(0, material);
	},
	enumerable: false,
	configurable: true
});