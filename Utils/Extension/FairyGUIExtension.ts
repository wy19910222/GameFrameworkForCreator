/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

declare namespace fgui.UIPackage {
	let defaultTexture: cc.Texture2D;	// 当加载图集失败时，用defaultTexture代替图集，避免报错影响界面响应功能
}
fgui.UIPackage.defaultTexture = new cc.Texture2D();
let getItemAsset = fgui.UIPackage.prototype.getItemAsset;
fgui.UIPackage.prototype.getItemAsset = function (item) {
	if (item.type === fgui.PackageItemType.Image) {
		if (!item.decoded) {
			item.decoded = true;
			let sprite = this._sprites[item.id];
			if (sprite != null) {
				let atlasTexture = this.getItemAsset(sprite.atlas);
				atlasTexture || (atlasTexture = fgui.UIPackage.defaultTexture);	// add
				if (atlasTexture != null) {
					let offsetX = sprite.offset.x - (sprite.originalSize.width - sprite.rect.width) / 2;
					let offsetY = -(sprite.offset.y - (sprite.originalSize.height - sprite.rect.height) / 2);
					let sf = new cc.SpriteFrame(atlasTexture, sprite.rect, sprite.rotated, new cc.Vec2(offsetX, offsetY), sprite.originalSize);
					if (item.scale9Grid) {
						sf.insetLeft = item.scale9Grid.x;
						sf.insetTop = item.scale9Grid.y;
						sf.insetRight = item.width - item.scale9Grid.xMax;
						sf.insetBottom = item.height - item.scale9Grid.yMax;
					}
					item.asset = sf;
				}
			}
		}
		return item.asset;
	} else {
		return getItemAsset.call(this, item);
	}
};


declare namespace fgui {
	interface GComponent {
		getAllChildren(this: GComponent, name: string): GObject[];	// 获得所有名字为name的子物体（不包括孙物体）
	}
}
// add
fgui.GComponent.prototype.getAllChildren = function (name) {
	let children: fgui.GObject[] = [];
	for (let index = 0, length = this.numChildren; index < length; ++index) {
		let child = this.getChildAt(index);
		child.name === name && children.push(child);
	}
	return children;
};


declare namespace fgui {
	interface GObject {
		title: string;		// 深度优先遍历找到第一个叫“title”且类型为GTextField的子物体，get/set它的text
		allIcon: string;	// get时返回icon，set时深度优先遍历所有叫“icon”且类型为GLoader的子物体，set它们的url
		allTitle: string;	// get时返回title，set时深度优先遍历所有叫“title”且类型为GTextField的子物体，set它们的text
	}
}
// add
Object.defineProperty(fgui.GObject.prototype, "title", {
	get: function () {
		return this.text;
	},
	set: function (value) {
		this.text = value;
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GObject.prototype, "allTitle", {
	get: function () {
		return this.title;
	},
	set: function (value) {
		this.title = value;
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GObject.prototype, "allIcon", {
	get: function () {
		return this.icon;
	},
	set: function (value) {
		this.icon = value;
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GComponent.prototype, "allTitle", {
	get: function () {
		let titleObjs = this.getAllChildren("title");
		for (let index = 0, length = titleObjs.length; index < length; ++index) {
			let titleObj = titleObjs[index];
			let childTitle = titleObj.allTitle;
			if (childTitle) {
				return childTitle;
			}
		}
		return undefined;
	},
	set: function (value) {
		this.getAllChildren("title").forEach(child => child.allTitle = value);
		this.updateGear(6);
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GComponent.prototype, "allIcon", {
	get: function () {
		let iconObjs = this.getAllChildren("icon");
		for (let index = 0, length = iconObjs.length; index < length; ++index) {
			let iconObj = iconObjs[index];
			let childIcon = iconObj.allIcon;
			if (childIcon) {
				return childIcon;
			}
		}
		return undefined;
	},
	set: function (value) {
		this.getAllChildren("icon").forEach(child => child.allIcon = value);
		this.updateGear(7);
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GButton.prototype, "allTitle", {
	get: function () {
		return this._title;
	},
	set: function (value) {
		this._title = value;
		value = (this._selected && this._selectedTitle) ? this._selectedTitle : this._title;
		this.getAllChildren("title").forEach(child => child.allTitle = value);
		this.updateGear(7);
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GButton.prototype, "allIcon", {
	get: function () {
		return this._icon;
	},
	set: function (value) {
		this._icon = value;
		value = (this._selected && this._selectedIcon) ? this._selectedIcon : this._icon;
		this.getAllChildren("icon").forEach(child => child.allIcon = value);
		this.updateGear(7);
	},
	enumerable: false,
	configurable: true
});


declare namespace fgui {
	interface GObject {
		templateVars: {[key: string]: number | string};		// 深度优先遍历找到第一个叫“title”且类型为GTextField的子物体，get/set它的templateVars
		allTemplateVars: {[key: string]: number | string};	// get时返回templateVars，set时深度优先遍历所有叫“title”且类型为GTextField的子物体，set它们的templateVars
	}
}
// add
Object.defineProperty(fgui.GObject.prototype, "templateVars", {
	get: function () {
		return null;
	},
	set: function (_) {
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GObject.prototype, "allTemplateVars", {
	get: function () {
		return this.templateVars;
	},
	set: function (value) {
		this.templateVars = value;
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GComponent.prototype, "templateVars", {
	get: function () {
		if (this._titleObject)
			return this._titleObject.templateVars;
		else
			return null;
	},
	set: function (value) {
		if (this._titleObject) {
			this._titleObject.templateVars = value;
			this.updateGear(6);
		}
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GComponent.prototype, "allTemplateVars", {
	get: function () {
		let titleObjs = this.getAllChildren("title");
		for (let index = 0, length = titleObjs.length; index < length; ++index) {
			let titleObj = titleObjs[index];
			let childTemplateVars = titleObj.allTemplateVars;
			if (childTemplateVars) {
				return childTemplateVars;
			}
		}
		return undefined;
	},
	set: function (value) {
		this.getAllChildren("title").forEach(child => child.allTemplateVars = value);
		this.updateGear(6);
	},
	enumerable: false,
	configurable: true
});


declare namespace fgui {
	interface GObject {
		progress: number;		// 深度优先遍历找到第一个叫“progress”且类型为GProgressBar的子物体，get/set它的value相对min到max的比例
		allProgress: number;	// get时返回progress，set时深度优先遍历所有叫“progress”且类型为GProgressBar的子物体，set它们的progress
	}
}
// add
Object.defineProperty(fgui.GObject.prototype, "progress", {
	get: function () {
		return null;
	},
	set: function (_) {
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GComponent.prototype, "progress", {
	get: function () {
		let progressBar = this.getChild("progress");
		return progressBar && progressBar.progress;
	},
	set: function (value) {
		let progressBar = this.getChild("progress");
		progressBar && (progressBar.progress = value);
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GProgressBar.prototype, "progress", {
	get: function () {
		return (this.value - this.min) / (this.max - this.min);
	},
	set: function (value) {
		this.value = this.min + (this.max - this.min) * value;
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GObject.prototype, "allProgress", {
	get: function () {
		return this.progress;
	},
	set: function (value) {
		this.progress = value;
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GComponent.prototype, "allProgress", {
	get: function () {
		let progressObjs = this.getAllChildren("progress");
		for (let index = 0, length = progressObjs.length; index < length; ++index) {
			let progressObj = progressObjs[index];
			let childProgress = progressObj.allProgress;
			if (childProgress != null) {
				return childProgress;
			}
		}
		return undefined;
	},
	set: function (value) {
		this.getAllChildren("progress").forEach(child => child.progress = value);
	},
	enumerable: false,
	configurable: true
});


declare namespace fgui {
	interface GObject {
		readonly button: GButton;	// 深度优先遍历找到第一个叫“button”且类型为GButton的子物体，get它
	}
}
// add
Object.defineProperty(fgui.GObject.prototype, "button", {
	get: function () {
		return null;
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GComponent.prototype, "button", {
	get: function () {
		let buttonObjs = this.getAllChildren("button");
		for (let index = 0, length = buttonObjs.length; index < length; ++index) {
			let buttonObj = buttonObjs[index];
			let button = buttonObj.button;
			if (button != null) {
				return button;
			}
		}
		return null;
	},
	enumerable: false,
	configurable: true
});
// add
Object.defineProperty(fgui.GButton.prototype, "button", {
	get: function () {
		return this;
	},
	enumerable: false,
	configurable: true
});


declare namespace fgui {
	interface GRoot {
		muted: boolean;		// 为GRoot新增静音功能，静音后，GRoot不再播放音频，而不是音量降为0
	}
}
// add
Object.defineProperty(fgui.GRoot.prototype, "muted", {
	get: function () {
		return this._muted;
	},
	set: function (value) {
		this._muted = value;
	},
	enumerable: true,
	configurable: true
});
let playOneShotSound = fgui.GRoot.prototype.playOneShotSound;
fgui.GRoot.prototype.playOneShotSound = function (clip, volumeScale) {
	this.muted || playOneShotSound.call(this, clip, volumeScale);	// modify
};


declare namespace fgui {
	interface GLoader {
		loadingExternal: boolean;		// 为GLoader新增外部加载状态
	}
}
//#region add 外部加载状态
Object.defineProperty(fgui.GLoader.prototype, "loadingExternal", {
	get: function () {
		return this._loadingExternal;
	},
	enumerable: false,
	configurable: true
});
//#endregion
fgui.GLoader.prototype["loadExternal"] = function () {
	//#region add 外部加载状态
	this._loadingExternal = true;
	//#endregion

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

		//#region add 外部加载状态
		_this._loadingExternal = false;
		//#endregion
	};
	if (fgui.ToolSet.startsWith(this._url, "http://")
		|| fgui.ToolSet.startsWith(this._url, "https://")
		|| fgui.ToolSet.startsWith(this._url, '/'))
		//#region modify 修复装载器不能装载无扩展名的远端图片url
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

fgui.GLoader.prototype["freeExternal"] = function (texture) {
	//#region add 释放图片资源
	cc.assetManager.releaseAsset(texture);
	//#endregion
};

// // 针对圆角头像的优化，复制头像并将四个角变透明而不是用遮罩
// declare namespace fgui {
// 	interface GObject {
// 		readonly filletRadiusX: number;
// 		readonly filletRadiusY: number;
// 		setFilletRadius(x: number, y: number): void;
// 	}
// }
// // add
// Object.defineProperty(fgui.GObject.prototype, "filletRadiusX", {
// 	get: function () {
// 		return null;
// 	},
// 	enumerable: false,
// 	configurable: true
// });
// // add
// Object.defineProperty(fgui.GObject.prototype, "filletRadiusY", {
// 	get: function () {
// 		return null;
// 	},
// 	enumerable: false,
// 	configurable: true
// });
// // add
// fgui.GLoader.prototype.setFilletRadius = function () {
// };
// // add
// Object.defineProperty(fgui.GComponent.prototype, "filletRadiusX", {
// 	get: function () {
// 		if (this._iconObject)
// 			return this._iconObject.filletRadiusX;
// 	},
// 	enumerable: false,
// 	configurable: true
// });
// // add
// Object.defineProperty(fgui.GComponent.prototype, "filletRadiusY", {
// 	get: function () {
// 		if (this._iconObject)
// 			return this._iconObject.filletRadiusY;
// 	},
// 	enumerable: false,
// 	configurable: true
// });
// // add
// fgui.GComponent.prototype.setFilletRadius = function (x, y) {
// 	if (this._iconObject)
// 		this._iconObject.setFilletRadius(x, y);
// };
// // add
// Object.defineProperty(fgui.GLoader.prototype, "filletRadiusX", {
// 	get: function () {
// 		return this._filletRadiusX;
// 	},
// 	enumerable: false,
// 	configurable: true
// });
// // add
// Object.defineProperty(fgui.GLoader.prototype, "filletRadiusY", {
// 	get: function () {
// 		return this._filletRadiusY;
// 	},
// 	enumerable: false,
// 	configurable: true
// });
// // add
// fgui.GLoader.prototype.setFilletRadius = function (x, y) {
// 	if (this._filletRadiusX !== x || this._filletRadiusY !== y) {
// 		this._filletRadiusX = x;
// 		this._filletRadiusY = y;
// 		this.loadContent();
// 	}
// };
// // add
// let _filletTexMap = new WeakMap<cc.Texture2D, {[radius: string]: cc.Texture2D}>();
// let onExternalLoadSuccess = fgui.GLoader.prototype["onExternalLoadSuccess"];
// fgui.GLoader.prototype["onExternalLoadSuccess"] = function (spriteFrame) {
// 	if (this._filletRadiusX && this._filletRadiusY) {
// 		let srcTex = spriteFrame.getTexture();
// 		if (srcTex) {
// 			let radiusTexObject = _filletTexMap.get(srcTex);
// 			if (!radiusTexObject) {
// 				radiusTexObject = {};
// 				_filletTexMap.set(srcTex, radiusTexObject);
// 			}
// 			let _filletRadiusX = Math.floor(srcTex.width * this._filletRadiusX);
// 			let _filletRadiusY = Math.floor(srcTex.height * this._filletRadiusY);
// 			let _filletRadius = `${_filletRadiusX},${_filletRadiusY}`;
// 			let roundRectTex = _filletTexMap[_filletRadius];
// 			if (!roundRectTex) {
// 				roundRectTex = filletTexture(srcTex, _filletRadiusX, _filletRadiusY);
// 				_filletTexMap[_filletRadius] = roundRectTex;
// 			}
// 			// spriteFrame.setTexture(roundRectTex);
// 			spriteFrame = new cc.SpriteFrame(roundRectTex);
// 		}
// 	}
// 	onExternalLoadSuccess.call(this, spriteFrame);
// };
// function filletTexture(tex: cc.Texture2D, radiusX: number, radiusY: number): cc.Texture2D {
// 	if (tex) {
// 		let [width, height] = [tex.width, tex.height];
// 		radiusX = Math.min(radiusX || 0, Math.floor(width * 0.5));
// 		radiusY = Math.min(radiusY || 0, Math.floor(height * 0.5));
// 		let canvas = document.createElement("canvas");
// 		canvas.width = width;
// 		canvas.height = height;
// 		let context = canvas.getContext("2d");
// 		context.drawImage(tex.getHtmlElementObj(), 0, 0);
// 		let imageData = context.getImageData(0, 0, width, height);
// 		let pixels = imageData.data;
// 		for (let y = 0; y < radiusY; ++y) {
// 			for (let x = 0; x < radiusX; ++x) {
// 				let tempX = x / radiusX - 1;
// 				let tempY = y / radiusY - 1;
// 				if (tempX * tempX + tempY * tempY > 1) {
// 					let i1 = (y * width + x) * 4;
// 					let i2 = (y * width + width - 1 - x) * 4;
// 					let i3 = ((height - 1 - y) * width + x) * 4;
// 					let i4 = ((height - 1 - y) * width + width - 1 - x) * 4;
// 					pixels[i1 + 3] = 0;
// 					pixels[i2 + 3] = 0;
// 					pixels[i3 + 3] = 0;
// 					pixels[i4 + 3] = 0;
// 				}
// 			}
// 		}
// 		context.putImageData(imageData,0,0);
// 		let newTex = new cc.Texture2D();
// 		newTex.initWithElement(canvas);
// 		return newTex;
// 	}
// 	return null;
// }