declare namespace wx {
	// https://developers.weixin.qq.com/minigame/dev/api/open-api/data/wx.getSharedCanvas.html
	function getSharedCanvas(): Canvas;

	// https://developers.weixin.qq.com/minigame/dev/api/open-api/context/wx.onMessage.html
	function onMessage(callback: (message: Object) => void): void;

	// https://developers.weixin.qq.com/minigame/dev/api/open-api/data/UserGameData.html
	interface UserGameData extends FriendInfo {
		KVDataList: KVData[];
	}
	// https://developers.weixin.qq.com/minigame/dev/api/open-api/data/wx.getFriendCloudStorage.html
	function getFriendCloudStorage(object: { keyList: string[] } & WXCallObject<{ data: UserGameData[] }>): void;

	// https://developers.weixin.qq.com/minigame/dev/api/open-api/data/FriendInfo.html
	interface FriendInfo {
		avatarUrl: string;
		nickname: string;
		openid: string;
	}
	// https://developers.weixin.qq.com/minigame/dev/api/open-api/data/wx.getPotentialFriendList.html
	function getPotentialFriendList(object: WXCallObject<{ list: FriendInfo[] }>): void;

	interface ShareMessageToFriendObject extends WXCallObject<{}> {
		openId: string;		// 发送对象的 openId
		title?: string;		// 转发标题，不传则默认使用当前小游戏的昵称。
		imageUrl?: string;		// 转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。显示图片长宽比是 5:4
		imageUrlId?: string;		// 审核通过的图片 ID，详见 使用审核通过的转发图片
	}
	// https://developers.weixin.qq.com/minigame/dev/api/open-api/data/wx.shareMessageToFriend.html
	function shareMessageToFriend(object: ShareMessageToFriendObject): void;

	interface FriendState extends FriendInfo {
		nickName: string;
		openId: string;
		gender: number;	// 0未设置 1男 2女
		sysState: number;	// 系统状态，0 掉线 1 在线
		userState: string;	// 该玩家的自定义状态信息，通过 GameServerManager.setState 接口设置
	}
	interface GameServerManager {
		// https://developers.weixin.qq.com/minigame/dev/api/game-server-manager/GameServerManager.getFriendsStateData.html
		getFriendsStateData(object: WXCallObject<{ list: FriendState[] }>): void;
	}

	// https://developers.weixin.qq.com/minigame/dev/api/open-api/data/wx.getUserCloudStorageKeys.html
	function getUserCloudStorageKeys(object: WXCallObject<{ keys: string[] }>): void;
}

// 给JS文档注释用的
type Object<K, V> = {[key: K] : V};

namespace MiniGameCanvasEngine {
	type CSSStyles = { [idOrClass: string]: { [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P] | number; } };
	type EventName = "touchstart" | "touchmove" | "touchend" | "touchcancel" | "click" | "scroll";
	type ElementType = "View" | "ScrollView" | "Image" | "Text";

	interface Layout extends Exclude<Element, "type" | "ctx"> {
		root: null;
		parentId: 0;
		parent: null;
		renderContext: RenderingContext;
		debugInfo: {
			layoutChildren: number,
			layoutTree: number,
			renderChildren: number,
			renderTree: number,
			updateRealLayout: 1,
			xmlTree: number
		}

		// 初始化渲染引擎：将编写的模板和样式传给渲染引擎，渲染引擎会生成布局树和渲染树等，准备渲染到canvas上面。
		init(template: string, style: CSSStyles);
		// 执行渲染：指定被渲染的context，绘制UI
		layout(context: RenderingContext);

		// 对于图片资源，如果不提前加载，渲染过程中可能出现挨个出现图片效果，影响体验。
		// 通过Layout.loadImgs可以预加载图片资源，在调用Layout.layout的时候渲染性能更好，体验更佳。
		// 注意图片路径不需要加./作为前缀，以小游戏根目录作为根目录
		loadImgs(arr: string[]);

		// 获取包含class为className的一组元素
		getElementsByClassName(className: string): Element[];
		// 获取元素id为elementId的一组元素
		getElementsById(idName: string): Element[];

		// 更新被绘制canvas的窗口信息，本渲染引擎并不关心是否会和其他游戏引擎共同使用，而本身又需要支持事件处理，
		// 因此，如果被渲染内容是绘制到离屏canvas，需要将最终绘制在屏幕上的绝对尺寸和位置信息更新到本渲染引擎。
		updateViewPort(box: {x: number, y: number, width: number, height: number});

		// 清理画布，之前的计算出来的渲染树也会一并清理，此时可以再次执行init和layout方法渲染界面。
		clear();
		// 调用此API可以清理对象池，释放内存
		clearPool();
		// 等价于按序调用Layout.clear和Layout.clearPool.
		clearAll();

		// 私有函数？
		destroyAll(tree?: LayoutNode);
		getChildByPos(tree: Element, x: number, y: number): Element;
		bindEvents();
		eventHandler(eventName: EventName);
		// name-字体名称，src-字体图集url，config-fnt字体文件的内容文本
		registBitMapFont(name: string, src: string, config: string);
	}

	interface ScrollViewElement extends Element {
		type: "ScrollView";
		scrollCanvas: wx.Canvas;
		scrollCtx: RenderingContext;
		scrollX: boolean
		scrollY: boolean
		scrollHeight: number
		scrollWidth: number
		scrollLeft: number;
		scrollTop: number;
	}

	interface ImageElement extends Element {
		type: "Image";
		img: wx.Image;
		src: string;
	}

	interface Element {
		id: number;
		type: ElementType;
		idName: string;
		className: string;

		root: Layout;
		parentId: number;
		parent: Element;

		isDestroyed: boolean;
		children: Element[];

		ctx: RenderingContext;
		style: CSSStyle;

		add(element: Element);
		destroy();

		// 事件相关函数
		emit(event: EventName, data?: any);
		off(event: EventName, callback: (e: wx.TouchEvent) => void);
		on(event: EventName, callback: (e: wx.TouchEvent) => void);
		once(event: EventName, callback: (e: wx.TouchEvent) => void);

		// 在某些场景下执行重渲染逻辑，比如通过getElementsById获取一个元素并且改变他的背景颜色，因为不涉及布局变更，执行Layout.repaint()即可。
		repaint();
	}
}