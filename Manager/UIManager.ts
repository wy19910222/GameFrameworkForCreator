/**
 * @auth wangyun
 * @date 2020/10/29-10:27
 */

import {AsyncBox} from "../Utils/AsyncBox";
import {ManagerRoot} from "../Root/ManagerRoot";
import {BaseManager} from "./BaseManager";
import {BaseUI, UIType} from "../UI/BaseUI";
import {FadeUI} from "../UI/FadeUI";

export type UIClass<T extends BaseUI> = { new(): T } & typeof BaseUI;

@jsClass
export class UIManager extends BaseManager {
	public static get instance(): UIManager {
		return ManagerRoot.instance.get(this);
	}

	private readonly FUI_FILE_EXTENSION = "bin";
	private readonly DIR_UI = "ui";

	public get root(): fgui.GComponent {
		return fgui.GRoot.inst;
	}

	// 不同UIType之间分层
	private _layerList: fgui.GComponent[] = [];
	// 界面实例列表，元素类型为壳子（AsyncBox），调用open时，先把壳子加到列表，再去加载界面对象，如果加载，再移除壳子。
	private _uiBoxList: AsyncBox<BaseUI>[] = [];

	// 用于临时遮挡整个屏幕，一般在不希望用户进行任何操作时使用
	private _topCollider: fgui.GComponent;
	// 不同目的的遮挡相互独立，只有map为空时才允许用户操作
	// 一级key一般是界面名称，偶尔是自定义字符串；二级key一般是自定义字符串
	private _topColliderObj: { [observable: string]: { [key: string]: boolean } } = {};

	private _waitLoadingUI: { view: fgui.GComponent, fadeIn?: () => void, fadeOut?: () => void };

	// 用弱表来检测界面对象有没有被回收，需要主动开启
	private _weakMap: WeakMap<BaseUI, number>;
	public set weakMapEnable(value: boolean) {
		this._weakMap = value ? window["WeakMap"] && new WeakMap() : null;
	}

	protected onLoad(): void {
		fgui.addLoadHandler(this.FUI_FILE_EXTENSION);
		this.initRoot();
		this.initTopCollider();
		this.initWaitLoadingUI(null);
		this.loadDefaultTexture();
	}

	private initRoot(): void {
		fgui.GRoot["_inst"] && !fgui.GRoot["_inst"].node.isValid || fgui.GRoot.create();
		cc.game.addPersistRootNode(this.root.node);

		for (let key in UIType) {
			if (UIType.hasOwnProperty(key)) {
				let element = UIType[key];
				if (typeof element === "number") {
					let layer = new fgui.GComponent();
					layer.name = key;
					layer.opaque = false;
					layer.visible = true;
					this._layerList[<number>element] = layer;
				}
			}
		}
		this._layerList.forEach(layer => this.root.addChild(layer));

		cc.view.resizeWithBrowserSize(true);
		this.resizeRoot();
		cc.view.on("canvas-resize", this.resizeRoot, this);
	}

	//#region resize
	private resizeRoot(): void {
		let root = this.root;
		let rootWidth = root.width;
		let rootHeight = root.height;
		this._layerList.forEach(layer => layer.setSize(rootWidth, rootHeight));
		for (let box of this._uiBoxList) {
			if (box && box.result) {
				let view = box.result.view;
				this.resize(view, rootWidth, rootHeight);
				this.reposition(view, rootWidth, rootHeight);
			}
		}
		if (this._topCollider) {
			this._topCollider.setSize(rootWidth, rootHeight);
		}
		if (this._waitLoadingUI) {
			let waitLoadingView = this._waitLoadingUI.view;
			this.resize(waitLoadingView, rootWidth, rootHeight);
			this.reposition(waitLoadingView, rootWidth, rootHeight);
		}
	}

	private resize(view: fgui.GComponent, parentWidth: number, parentHeight: number): void {
		let scale = Math.min(parentWidth / view.sourceWidth, parentHeight / view.sourceHeight);
		view.setSize(parentWidth / scale, parentHeight / scale);
		view.setScale(scale, scale);
	}

	private reposition(view: fgui.GComponent, parentWidth: number, parentHeight: number): void {
		let viewWidth = view.actualWidth;
		let viewHeight = view.actualHeight;
		let offsetX = (parentWidth - viewWidth) * 0.5;
		let offsetY = (parentHeight - viewHeight) * 0.5;
		if (view.pivotAsAnchor) {
			// If pivot is anchor, set position based pivot
			// then offset view if size is limit
			view.setPosition(offsetX + viewWidth * view.pivotX, offsetY + viewHeight * view.pivotY);
		} else {
			// If pivot is anchor, set position to zero
			// then offset view if size is limit
			view.setPosition(offsetX, offsetY);
		}
	}
	//#endregion

	private initTopCollider(): void {
		this._topCollider = new fgui.GComponent();
		this._topCollider.name = "TopCollider";
		this._topCollider.sortingOrder = 1000;
		this._topCollider.opaque = true;
		this._topCollider.visible = false;
		this._topCollider.setSize(this.root.width, this.root.height);
		this._topCollider.onClick(() => console.warn("TopCollider clicked!"), this);
		this.root.addChild(this._topCollider);
	}

	public addTopCollider(observable: typeof BaseUI | BaseUI | string, key?: string): void {
		if (observable) {
			if (observable instanceof Function || observable instanceof Object) {
				observable = cc.js.getClassName(observable);
			}

			if (Object.keys(this._topColliderObj).length <= 0) {
				// key数量从0变成1，遮挡生效
				if (!this._topCollider.visible) {
					console.log("TopCollider open");
					this._topCollider.visible = true;
				}
			}
			let map = this._topColliderObj[observable];
			map || (this._topColliderObj[observable] = map = {});
			key = key || "_default";
			if (!map.hasOwnProperty(key)) {
				map[key] = true;
				console.log("addTopCollider", observable, key);
			}
		}
	}

	public removeTopCollider(observable: typeof BaseUI | BaseUI | string, key?: string): void {
		if (observable) {
			if (observable instanceof Function || observable instanceof Object) {
				observable = cc.js.getClassName(observable);
			}

			let map = this._topColliderObj[observable];
			if (map) {
				key && delete map[key];
				if (!key || Object.keys(map).length <= 0) {
					delete this._topColliderObj[observable];
				}
				console.log("removeTopCollider", observable, key);
			}
			if (Object.keys(this._topColliderObj).length <= 0) {
				if (this._topCollider.visible) {
					console.log("TopCollider close");
					this._topCollider.visible = false;
				}
			}
		}
	}

	public hasTopColliderKey(observable: typeof BaseUI | BaseUI | string, key?: string): boolean {
		if (observable) {
			if (observable instanceof Function || observable instanceof Object) {
				observable = cc.js.getClassName(observable);
			}
			let map = this._topColliderObj[observable];
			return map && (!key || map[key]);
		}
		return false;
	}

	public initWaitLoadingUI<T extends BaseUI>(uiClass: UIClass<T>): void {
		// 借赋值为null来标记加载中状态
		if (this._waitLoadingUI !== null) {
			this._waitLoadingUI && this._waitLoadingUI.view.dispose();
			if (uiClass) {
				// 加载加载中界面
				this._waitLoadingUI = null;	// 借赋值为null来标记加载中状态
				this.createUI(uiClass).then(waitLoadingUI => {
					waitLoadingUI.view.onClick(() => console.warn("WaitLoadingUI clicked!"), this);
					this._layerList[uiClass.uiType].addChild(waitLoadingUI.view);
					this._waitLoadingUI = waitLoadingUI;
				});
			} else {
				// 创建一个空的FairyGUI组件当做加载中界面
				let view = new fgui.GComponent();
				view.name = "WaitLoadingUI";
				view.sortingOrder = 999;
				view.opaque = true;
				view.visible = false;
				this.root.addChild(view);
				this._waitLoadingUI = { view };
				this._waitLoadingUI.view.onClick(() => console.warn("WaitLoadingComp clicked!"), this);

				let root = this.root;
				let rootWidth = root.width;
				let rootHeight = root.height;
				view.sourceWidth = rootWidth;
				view.sourceHeight = rootHeight;
				this.resize(view, rootWidth, rootHeight);
				this.reposition(view, rootWidth, rootHeight);
			}
		}
	}

	public gotoScene<T extends BaseUI>(sceneUIClass: UIClass<T>, closeAllWindow = true): AsyncBox<T> {
		if (sceneUIClass && sceneUIClass.uiType === UIType.Scene) {
			// 找出所有要销毁的界面
			let closeList: AsyncBox<BaseUI>[] = [];
			closeAllWindow && closeList.push(...this.list([UIType.Window]));	// 所有窗口界面
			closeList.push(...this.list([UIType.ScenePart]));	// 所有场景附属界面
			closeList.push(...this.list([UIType.Scene]));	// 所有场景界面
			// 尚未加载成功的界面直接取消
			closeList = closeList.filter(closeBox => {
				if (closeBox.isDone) {
					return true;
				} else {
					closeBox.cancel();
					return false;
				}
			});
			let box = this._open(sceneUIClass);
			box && box.then(() => {
				closeList.forEach(closeBox => (<FadeUI>closeBox.result).exitClicked || this._close(closeBox));
			});
			return box;
		}
		return null;
	}

	public open<T extends BaseUI>(uiClass: UIClass<T>, ...args: any[]): AsyncBox<T> {
		if (uiClass && uiClass.uiType !== UIType.Scene) {
			return this._open(uiClass, ...args);
		}
		return null;
	}
	private _open<T extends BaseUI>(uiClass: UIClass<T>, ...args: any[]): AsyncBox<T> {
		if (uiClass) {
			let box = new AsyncBox<T>(this.createUI(uiClass, ...args), uiClass);
			this._uiBoxList.push(box);
			let uiName = cc.js.getClassName(uiClass);
			console.log(`UIManager.open [${uiName}]`);
			box.then(uiInst => {
				console.log(`UIManager.open [${uiName}] succeed`);
				this._layerList[uiClass.uiType].addChild(uiInst.view);
			});
			box.catch(reason => {
				if (box.canceled) {
					console.log(`UIManager.open [${uiName}] canceled`);
					box.result && box.result.node.destroy();
				} else {
					console.error(`UIManager.open [${uiName}] failed:`, reason);
				}
				let index = this._uiBoxList.indexOf(box);
				index !== -1 && this._uiBoxList.splice(index, 1);
			});

			if (uiClass.willShowLoading && this._waitLoadingUI) {
				// 显示“界面加载中”
				if (this._waitLoadingUI.fadeIn) {
					this._waitLoadingUI.fadeIn();
				} else {
					this._waitLoadingUI.view.visible = true;
				}
				box.finally(() => {
					if (this._waitLoadingUI.fadeOut) {
						this._waitLoadingUI.fadeOut();
					} else {
						this._waitLoadingUI.view.visible = false;
					}
				});
			}
			return box;
		}
		return null;
	}

	public hide<T extends BaseUI>(uiClass: UIClass<T>): void {
		let index = this.getIndex(uiClass);
		index !== -1 && this._uiBoxList[index].then(baseUI => baseUI.view.visible = false);
	}

	public show<T extends BaseUI>(uiClass: UIClass<T>): void {
		let index = this.getIndex(uiClass);
		index !== -1 && this._uiBoxList[index].then(baseUI => baseUI.view.visible = true);
	}

	public close(uiClassOrInstanceOrBox: typeof BaseUI | BaseUI | AsyncBox<BaseUI>): void {
		if (uiClassOrInstanceOrBox) {
			let uiType: UIType;
			if (uiClassOrInstanceOrBox instanceof BaseUI) {
				uiType = (<typeof BaseUI> uiClassOrInstanceOrBox.constructor).uiType;
			} else if (uiClassOrInstanceOrBox instanceof Function) {
				uiType = uiClassOrInstanceOrBox.uiType;
			} else {
				uiType = uiClassOrInstanceOrBox.tag.uiType;
			}
			if (uiType !== UIType.Scene) {
				this._close(uiClassOrInstanceOrBox);
			}
		}
	}
	private _close(uiClassOrInstanceOrBox: typeof BaseUI | BaseUI | AsyncBox<BaseUI>): void {
		if (uiClassOrInstanceOrBox) {
			if (uiClassOrInstanceOrBox instanceof BaseUI || uiClassOrInstanceOrBox instanceof Function) {
				console.log(`UIManager.close [${cc.js.getClassName(uiClassOrInstanceOrBox)}]`);
				this.destroyUI(uiClassOrInstanceOrBox);
			} else {
				console.log(`UIManager.close [${cc.js.getClassName(uiClassOrInstanceOrBox.tag)}]`);
				this.destroyUIBox(uiClassOrInstanceOrBox);
			}
		}
	}

	/**
	 * 关闭指定类型的所有界面对象
	 * @param types 需要关闭的界面类型，如果为null，则关闭全类型。
	 * @param except 例外的界面
	 */
	public closeAll(types: UIType[], except?: typeof BaseUI): void {
		console.log("CloseAllUI ", types, except && cc.js.getClassName(except));
		this.list(types).filter(box => box.tag !== except).forEach(box => {
			this._uiBoxList.splice(this._uiBoxList.indexOf(box), 1);
			if (box.isDone) {
				box.result && box.result.node.destroy();
			} else {
				box.cancel();
			}
		});
	}

	public isExist(uiClass: typeof BaseUI): boolean {
		return this.getIndex(uiClass) !== -1;
	}

	public get<T extends BaseUI>(uiClass: UIClass<T>, notFindLog = true): AsyncBox<T> {
		let index = this.getIndex(uiClass);
		index === -1 && notFindLog && console.warn(`Find ui error: ${cc.js.getClassName(uiClass)} is not found!`);
		return <AsyncBox<T>>this._uiBoxList[index];
	}

	/**
	 * 获得指定类型的所有界面对象
	 * @param types 想要获得的界面类型，如果为null，则获得全类型。
	 */
	public list(types?: UIType[]): AsyncBox<BaseUI>[] {
		return this._uiBoxList.filter(box => !types || types.indexOf(box.tag.uiType) !== -1);
	}

	public getScene(): AsyncBox<BaseUI> {
		return Array.findLast(this._uiBoxList, uiBox => uiBox.tag.uiType === UIType.Scene);
	}

	private async createUI<T extends BaseUI>(uiClass: UIClass<T>, ...args: any[]): Promise<T> {
		// 先加载对应包和额外包的描述文件，再根据加载进来的数据，加载依赖的资源（图集和音效）
		let pkgName = uiClass.getPkgName();
		let pkgNames = uiClass.getExtPkgNames();
		pkgNames.push(pkgName);
		await this.loadPkg(pkgNames);

		// 创建界面对象
		uiClass.uiBind();
		let compName = uiClass.getCompName();
		let viewObj = fgui.UIPackage.createObject(pkgName, compName);
		let view = viewObj && viewObj.asCom;
		if (!view) {
			let reason = `Create ui [${pkgName}/${compName}] failed!`;
			console.error(reason);
			throw reason;
		}

		// 界面逻辑类实例
		let node = new cc.Node(cc.js.getClassName(uiClass));
		node.setParent(view.node);
		let uiInstance = node.addComponent(<{ new (): T }>uiClass);
		uiInstance.setView(view, ...args);
		this._weakMap && this._weakMap.set(uiInstance, Date.now());

		// 初始化界面对象层级、宽高、位置
		view.sortingOrder = uiClass.sortingOrder;
		let rootWidth = this.root.width;
		let rootHeight = this.root.height;
		this.resize(view, rootWidth, rootHeight);
		this.reposition(view, rootWidth, rootHeight);

		return uiInstance;
	}

	private destroyUI(uiClassOrInstance: typeof BaseUI | BaseUI): void {
		let index = this.getIndex(uiClassOrInstance);
		if (index !== -1) {
			let uiBox = this._uiBoxList.splice(index, 1)[0];
			if (uiBox.isDone) {
				uiBox.result && uiBox.result.node.destroy();
			} else {
				uiBox.cancel();
			}
		} else {
			console.error("Destroy ui error: " + cc.js.getClassName(uiClassOrInstance) + " is not found!");
		}
	}
	private destroyUIBox(uiBox: AsyncBox<BaseUI>): void {
		let index = this._uiBoxList.lastIndexOf(uiBox);
		if (index !== -1) {
			this._uiBoxList.splice(index, 1);
			if (uiBox.isDone) {
				uiBox.result && uiBox.result.node.destroy();
			} else {
				uiBox.cancel();
			}
		} else {
			console.error("Destroy ui error: " + cc.js.getClassName(uiBox.tag) + " is not found!");
		}
	}

	private getIndex(uiClassOrInstance: typeof BaseUI | BaseUI): number {
		if (uiClassOrInstance instanceof Function) {
			// 类
			for (let index = this._uiBoxList.length - 1; index >= 0; --index) {
				if (this._uiBoxList[index].tag === uiClassOrInstance) {
					return index;
				}
			}
		} else {
			// 实例
			for (let index = this._uiBoxList.length - 1; index >= 0; --index) {
				if (this._uiBoxList[index].result === uiClassOrInstance) {
					return index;
				}
			}
		}
		return -1;
	}

	public clearPkgResByClass(uiClass: typeof BaseUI): void {
		if (uiClass) {
			let pkgNameObj: {[key: string]: boolean} = {};
			pkgNameObj[uiClass.getPkgName()] = true;
			// let extPkgNames = uiClass.getExtPkgNames();
			// extPkgNames && extPkgNames.forEach(pkgName => pkgNameObj[pkgName] = true);
			this.clearPkgRes(Object.keys(pkgNameObj));
		}
	}

//#region Load package
	private loadDefaultTexture(): void {
		cc.resources.load(`${this.DIR_UI}/DefaultTexture`, cc.Texture2D, (error, texture: cc.Texture2D) => {
			error || (fgui.UIPackage.defaultTexture = texture);
		});
	}

	/**
	 * 加载描述文件和FairyGUI包依赖的资源（图集和音效）
	 */
	public async loadPkg(pkgNames: string[], progress?: (finish: number, total: number) => void): Promise<void> {
		console.log(`Load package: [${pkgNames.join(", ")}]`);
		let pkgs = await this.loadPkgBin(pkgNames, null).catch(reason => {
			console.error(`Load package binary error: [${pkgNames.join(", ")}]`, reason);
			throw reason;
		});
		let pkgCount = pkgNames.length;
		await this.loadPkgRes(pkgs, (finish, total) => progress && progress(finish + pkgCount, total + pkgCount)).catch(reason => {
			console.error(`Load package resource error: [${pkgNames.join(", ")}]`, reason);
			throw reason;
		});
		console.log(`Load package: [${pkgNames.join(", ")}] succeed!`);
	}

	/**
	 * 加载描述文件
	 */
	private loadPkgBin(pkgNames: string[], progress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void): Promise<fgui.UIPackage[]> {
		return new Promise((resolve, reject) => {
			let fuiFilenamePrefix = this.DIR_UI + "/";
			let resKeys = pkgNames.map(pkgName => fuiFilenamePrefix + pkgName);
			let unloadedPaths = resKeys.filter(resKey => !cc.resources.get(resKey));
			let success = () => {
				try {
					resolve(resKeys.map(resKey => fgui.UIPackage.addPackage(resKey)));
				} catch (e) {
					console.error(e);
					resolve([]);
				}
			};
			if (unloadedPaths.length > 0) {
				cc.resources.load(unloadedPaths, cc.Asset, progress, error => {
					if (!error) {
						success();
					} else {
						reject(error);
					}
				});
			} else {
				success();
			}
		});
	}

	/**
	 * 加载FairyGUI包依赖的资源（图集和音效）
	 */
	private loadPkgRes(pkgs: fgui.UIPackage[], progress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void): Promise<cc.Asset[]> {
		return new Promise((resolve, reject) => {
			let files: string[] = [];
			pkgs.forEach(pkg => {
				let pkgItems: fgui.PackageItem[] = pkg["_items"];
				let fileSet = new Set<string>();
				pkgItems.filter(item => item.file).forEach(item => fileSet.add(item.file));
				files.push(...fileSet.values());
			});
			let loadedAssets: cc.Asset[] = [];
			let unloadedPaths: string[] = [];
			files.forEach(file => {
				let asset = cc.resources.get(file);
				asset ? loadedAssets.push(asset) : unloadedPaths.push(file);
			});
			if (unloadedPaths.length > 0) {
				cc.resources.load(unloadedPaths, cc.Asset, progress, (error, assets) => {
					if (!error) {
						resolve(loadedAssets.concat(assets));
					} else {
						reject(error);
					}
				});
			} else {
				resolve(loadedAssets);
			}
		});
	}

	public isPkgLoaded(pkgName: string): boolean {
		return !!cc.resources.get(`${this.DIR_UI}/${pkgName}`);
	}

	/**
	 * 过滤掉被界面占用的包后再清理指定的包
	 * @param pkgNames 需要清理的包名
	 */
	public clearPkgRes(pkgNames: string[]): void {
		let usingPkgNameObject: {[key: string]: boolean} = {};	// 正在使用的界面包的名称
		this._uiBoxList.forEach(uiBox => {
			let uiClass: typeof BaseUI = uiBox.tag;
			usingPkgNameObject[uiClass.getPkgName()] = true;
			let extPkgNames = uiClass.getExtPkgNames();
			extPkgNames && extPkgNames.forEach(pkgName => usingPkgNameObject[pkgName] = true);
		});
		pkgNames = pkgNames ? pkgNames.filter(pkgName => !usingPkgNameObject[pkgName]) : [];
		console.log("Clear package atlas: " + JSON.stringify(pkgNames));
		try {
			pkgNames.forEach(pkgName => {
				let pkg = fgui.UIPackage.getByName(pkgName);
				pkg && fgui.UIPackage.removePackage(pkgName);
			});
		} catch (e) {
			console.error(e);
		}
	}
//#endregion
}