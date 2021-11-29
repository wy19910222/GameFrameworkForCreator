declare namespace wx {
	interface WXCallObject<T> {
		success?: (res: { errCode?: number, errMsg?: string } & T) => void;	// 接口调用成功的回调函数
		fail?: (res: { errCode?: number, errMsg?: string }) => void;	// 接口调用失败的回调函数
		complete?: (res: { errCode?: number, errMsg?: string } & T) => void	// 接口调用结束的回调函数（调用成功、失败都会执行）	
	}

	// 加载成功返回font family，失败则返回null
	function loadFont(source: string): string | null;

	/**
	 * 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
	 */
	interface LoginObject extends WXCallObject<{ code: string }> { }
	// https://developers.weixin.qq.com/minigame/dev/api/wx.login.html
	// 调用接口获取**登录凭证（code）**进而换取用户登录态信息，包括用户的**唯一标识（openid）** 及本次登录的 **会话密钥（session_key）**等。**用户数据的加解密通讯**需要依赖会话密钥完成。
	function login(object: LoginObject): void;
	// https://developers.weixin.qq.com/minigame/dev/api/wx.checkSession.html
	function checkSession(object: WXCallObject<{}>): void;

	interface AuthSetting {
		// 是否授权用户信息，对应接口 wx.getUserInfo
		userInfo: boolean;
		// 是否授权地理位置，对应接口 wx.getLocation wx.chooseLocation
		userLocation: boolean;
		// 是否授权通讯地址，对应接口 wx.chooseAddress
		address: boolean;
		// 是否授权发票抬头，对应接口 wx.chooseInvoiceTitle
		invoiceTitle: boolean;
		// 是否授权微信运动步数，对应接口 wx.getWeRunData
		werun: boolean;
		// 是否授权录音功能，对应接口 wx.startRecord
		record: boolean;
		// 是否授权保存到相册 wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum
		writePhotosAlbum: boolean;
		// 是否授权摄像头
		camera: boolean;
	}
	interface GetSettingObject extends WXCallObject<{ authSetting: {[scope: string]: boolean} }> { }
	// https://developers.weixin.qq.com/minigame/dev/api/wx.getSetting.html
	function getSetting(object: GetSettingObject): void;
	interface OpenSettingObject extends WXCallObject<{ authSetting: {[scope: string]: boolean} }> { }
	// https://developers.weixin.qq.com/minigame/dev/api/wx.openSetting.html
	function openSetting(object: OpenSettingObject): void;

	// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html
	interface UserInfo {
		// 用户昵称
		nickName: string;
		// 用户头像图片的 URL。
		// URL 最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 640x640 的正方形头像，46 表示 46x46 的正方形头像，剩余数值以此类推。默认132），
		// 用户没有头像时该项为空。若用户更换头像，原有头像 URL 将失效。
		avatarUrl: string;
		// 用户性别，0 未知，1 男性，2 女性
		gender: number;
		// 用户所在国家
		country: string;
		// 用户所在省份
		province: string;
		// 用户所在城市
		city: string;
		// 显示 country，province，city 所用的语言，en 英文，zh_CN 简体中文，zh_TW 繁体中文。
		language: string;
	}
	interface GetUserProfileObject extends WXCallObject<{userInfo: UserInfo}> {
		desc: string;	// 声明获取用户个人信息后的用途，不超过30个字符
		lang?: string;	// 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en。
	}
	// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html
	// 获取用户信息。每次请求都会弹出授权窗口，用户同意后返回 userInfo。
	function getUserProfile(object: GetUserProfileObject): void;

	interface GetUserInfoSuccessObject {
		userInfo: UserInfo;	// 用户信息对象，不包含 openid 等敏感信息
		rawData: string;	// 不包括敏感信息的原始数据字符串，用于计算签名。
		signature: string;	// 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档 [signature](./signature.md)。
		encryptedData: string;	// 包括敏感数据在内的完整用户信息的加密数据，详细见[加密数据解密算法](./signature.md#加密数据解密算法)
		iv: string;	// 加密算法的初始向量，详细见[加密数据解密算法](./signature.md#加密数据解密算法)
	}
	interface GetUserInfoObject extends WXCallObject<GetUserInfoSuccessObject> {
		withCredentials?: boolean;	// 是否带上登录态信息
		lang?: string;	// 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en。
	}
	// https://developers.weixin.qq.com/minigame/dev/api/wx.getUserInfo.html
	// 获取用户信息，withCredentials 为 true 时需要先调用 [wx.login] 接口。
	function getUserInfo(object: GetUserInfoObject): void;

	interface UserInfoButton {
		type: string;	// "text" | "image"
		text: string;
		image: string;
		style: ButtonStyle;
		show(): void;
		hide(): void;
		destroy(): void;
		onTap(callback: (res: { errCode?: number, errMsg?: string } & GetUserInfoSuccessObject) => void): void
		offTap(callback: () => void): void
	}
	interface ButtonStyle {
		left?: number;
		top?: number;
		width?: number;
		height?: number;
		backgroundColor?: string;
		borderColor?: string;
		borderWidth?: number;
		borderRadius?: number;
		textAlign?: string;	// "left" | "center" | "right"
		fontSize?: number;
		lineHeight?: number;
	}
	interface CreateUserInfoButtonObject {
		type: string;	// "text" | "image"
		text?: string;
		image?: string;
		style: ButtonStyle;
		withCredentials: boolean;
		lang?: string;
	}
	// https://developers.weixin.qq.com/minigame/dev/api/wx.createUserInfoButton.html
	function createUserInfoButton(info: CreateUserInfoButtonObject): UserInfoButton;

	interface SystemInfo {
		brand: string;	// 设备品牌
		model: string;	// 设备型号
		pixelRatio: number;	// 设备像素比
		screenWidth: number;	// 屏幕宽度，单位px
		screenHeight: number;	// 屏幕高度，单位px
		windowWidth: number;	// 可使用窗口宽度，单位px
		windowHeight: number;	// 可使用窗口高度，单位px
		statusBarHeight: number;	// 状态栏的高度，单位px
		language: string;	// 微信设置的语言
		version: string;	// 微信版本号
		system: string;	// 操作系统及版本
		platform: string;	// 客户端平台
		fontSizeSetting: number;	// 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准
		SDKVersion: string;	// 客户端基础库版本
		// https://developers.weixin.qq.com/minigame/dev/guide/performance/perf-benchmarkLevel.html
		benchmarkLevel?: number;	// 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50）
		batteryLevel?: number;	// 电池电量
		devicePixelRatio?: number;
	}
	// https://developers.weixin.qq.com/minigame/dev/api/base/system/wx.getSystemInfoSync.html
	function getSystemInfoSync(): SystemInfo;

	interface AppShowOptions {
		path: string;
		query: { [key: string]: string };
		scene: number;
		shareTicket: string;
		referrerInfo: ReferrerInfo;
	}
	interface ReferrerInfo {
		appId: string;
		extraData: { [key: string]: any };
	}

	function onShow(callback: (res: AppShowOptions) => void): void;
	function offShow(callback: (res: AppShowOptions) => void): void;
	function onHide(callback: () => void): void;
	function offHide(callback: () => void): void;

	interface ShowShareMenuObject extends WXCallObject<{}> {
		withShareTicket?: boolean;
		menus?: string[];
	}
	// https://developers.weixin.qq.com/minigame/dev/api/share/wx.showShareMenu.html
	function showShareMenu(object: ShowShareMenuObject): void;
	function hideShareMenu(object: WXCallObject<{}>): void;

	// https://developers.weixin.qq.com/minigame/dev/api/share/wx.onShareTimeline.html
	interface shareTimeLineObj {
		title?: string;	// 转发标题，不传则默认使用当前小游戏的昵称。
		imageUrl: string;	// 转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。（该图片用于分享到朋友圈的卡片以及从朋友圈转发到会话消息的卡片展示）
		query?: string;	//	查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 wx.getLaunchOptionsSync() 或 wx.onShow() 获取启动参数中的 query。不传则默认使用当前页面query。
	}
	// 朋友圈分享
	function onShareTimeline(callback: () => shareTimeLineObj): void;
	function offShareTimeline(callback: () => void): void;

	// https://developers.weixin.qq.com/minigame/dev/api/share/wx.onShareAppMessage.html
	function onShareAppMessage(callback: () => ShareAppMessageObject): void;

	interface ShareAppMessageObject {
		// 转发标题，不传则默认使用当前小游戏的昵称。
		title?: string;
		// 转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。显示图片长宽比是 5:4
		imageUrl?: string;
		// 查询字符串，从这条转发消息进入后，可通过 wx.getLaunchInfoSync() 或 wx.onShow() 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。
		query?: string;
		// 审核通过的图片 ID，详见 使用审核通过的转发图片
		imageUrlId?: string;
		// true 是否转发到当前群。该参数只对从群工具栏打开的场景下生效，默认转发到当前群，填入false时可转发到其他会话。
		toCurrentGroup?: boolean;
		// 独立分包路径。详见 小游戏独立分包指南
		path?: string;
	}
	// https://developers.weixin.qq.com/minigame/dev/api/share/wx.shareAppMessage.html
	function shareAppMessage(object: ShareAppMessageObject): void;

	interface UpdateShareMenuObject extends WXCallObject<{}> {
		// 是否使用带 shareTicket 的转发详情
		withShareTicket?: boolean;
		// 是否是动态消息，详见动态消息
		isUpdatableMessage?: boolean;
		// 动态消息的 activityId。通过 updatableMessage.createActivityId 接口获取
		activityId?: string;
		// 动态消息的模板信息
		templateInfo?: { parameterList?: { name: string, value: string }[] };
	}
	// https://developers.weixin.qq.com/minigame/dev/api/share/wx.updateShareMenu.html
	function updateShareMenu(object: UpdateShareMenuObject): void;

	// https://developers.weixin.qq.com/minigame/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html
	function getLaunchOptionsSync(): AppShowOptions;

	function getEnterOptionsSync(): AppShowOptions;

	interface ShowToastObject extends WXCallObject<{}> {
		title: string;
		icon?: "success" | "error" | "loading" | "none";
		image?: string; // image 的优先级高于 icon
		duration?: number; // 单位毫秒，默认：1500
		mask?: boolean; // 默认：false
	}
	// https://developers.weixin.qq.com/minigame/dev/api/ui/interaction/wx.showToast.html
	function showToast(object: ShowToastObject): void;

	interface ShowLoadingObject extends WXCallObject<{}> {
		title: string;
		mask?: boolean; // 默认：false
	}
	// https://developers.weixin.qq.com/minigame/dev/api/ui/interaction/wx.showLoading.html
	function showLoading(object: ShowLoadingObject): void;
	// https://developers.weixin.qq.com/minigame/dev/api/ui/interaction/wx.hideLoading.html
	function hideLoading(object?: WXCallObject<{}>): void;

	interface ShowModalObject extends WXCallObject<{ confirm: boolean, cancel: boolean }> {
		title: string;	// 提示的标题
		content: string;	// 提示的内容

		showCancel?: boolean;	// 是否显示取消按钮，默认为 true

		cancelText?: string;	// 取消按钮的文字，默认为"取消"，最多 4 个字符
		cancelColor?: string;	// 取消按钮的文字颜色，默认为"#000000"

		confirmText?: string;	// 确定按钮的文字，默认为"确定"，最多 4 个字符
		confirmColor?: string;	// 确定按钮的文字颜色，默认为"#3CC51F"
	}
	// https://developers.weixin.qq.com/minigame/dev/api/ui/interaction/wx.showModal.html
	function showModal(object: ShowModalObject): void;

	// https://developers.weixin.qq.com/minigame/dev/guide/open-ability/ad/rewarded-video-ad.html
	interface RewardedVideoAd {
		load(): Promise<any>;
		// https://developers.weixin.qq.com/minigame/analysis/selfanalysis.html#_2-配置埋点上报
		show(userBehaviorBranchAnalyticsArgs?: {branchId: string, branchDim: string}): Promise<any>;
		onLoad(callback: () => void): void;
		offLoad(callback: () => void): void;
		// https://developers.weixin.qq.com/minigame/dev/api/RewardedVideoAd.onError.html
		onError(callback: (err: { errMsg: string, errCode: number }) => void): void;
		offError(callback: (err: { errMsg: string, errCode: number }) => void): void;
		onClose(callback: (res: { isEnded: boolean }) => void): void;
		offClose(callback: (res: { isEnded: boolean }) => void): void;
	}
	function createRewardedVideoAd(object: { adUnitId: string }): RewardedVideoAd;

	interface UpdateManager {
		applyUpdate(): void;
		onCheckForUpdate(callback: (res: { hasUpdate: boolean }) => void): void;
		onUpdateFailed(callback: () => void): void;
		onUpdateReady(callback: () => void): void;
	}
	function getUpdateManager(): UpdateManager;

	// https://developers.weixin.qq.com/minigame/dev/api/base/app/life-cycle/wx.exitMiniProgram.html
	function exitMiniProgram(object?: WXCallObject<{}>): void;

	interface ToTempFilePathSyncObject {
		x?: number;			// 0			截取canvas的左上角横坐标
		y?: number;			// 0			截取canvas的左上角纵坐标
		width?: number;			// canvas的宽度	截取canvas的宽度
		height?: number;		// canvas的高度	截取canvas的高度
		destWidth?: number;		// canvas的宽度	目标文件的宽度，会将截取的部分拉伸或压缩至该数值
		destHeight?: number;	// canvas的高度	目标文件的高度，会将截取的部分拉伸或压缩至该数值
		fileType?: string; 		// "png"		目标文件的类型，"jpg"或"png"
		quality?: number;		// 1.0			jpg图片的质量，仅当 fileType 为 jpg 时有效。取值范围为 0.0（最低）- 1.0（最高），不含 0。不在范围内时当作 1.0
	}
	interface ToTempFilePathObject extends ToTempFilePathSyncObject, WXCallObject<{ tempFilePath: string }> {
	}
	interface Canvas extends HTMLCanvasElement {
		toDataURL(): string;
		toTempFilePath(object: ToTempFilePathObject): void;
		toTempFilePathSync(object: ToTempFilePathSyncObject): string;
	}
	// https://developers.weixin.qq.com/minigame/dev/api/render/canvas/wx.createCanvas.html
	function createCanvas(): Canvas;

	// https://developers.weixin.qq.com/minigame/dev/api/open-api/context/OpenDataContext.html
	interface OpenDataContext {
		canvas: Canvas;
		postMessage(message: Object);
	}
	// https://developers.weixin.qq.com/minigame/dev/api/open-api/context/wx.getOpenDataContext.html
	function getOpenDataContext(): OpenDataContext;

	// https://developers.weixin.qq.com/minigame/dev/api/open-api/data/KVData.html
	interface KVData {
		key: string;
		value: string;
	}
	// https://developers.weixin.qq.com/minigame/dev/api/open-api/data/wx.setUserCloudStorage.html
	function setUserCloudStorage(object: {KVDataList: KVData[]} & WXCallObject<{}>);

	// https://developers.weixin.qq.com/minigame/dev/api/BannerAd.html
	interface bannerStyle {
		left?: number,//	banner 广告组件的左上角横坐标	
		top?: number,//	banner 广告组件的左上角纵坐标	
		width?: number,//	banner 广告组件的宽度。最小 300，最大至 屏幕宽度（屏幕宽度可以通过 wx.getSystemInfoSync() 获取）。
		height?: number,//	banner 广告组件的高度	
		realWidth?: number,//	banner 广告组件经过缩放后真实的宽度	
		realHeight?: number,//	banner 广告组件经过缩放后真实的高度
	}
	interface BannerAd {
		style: bannerStyle;
		show(): Promise<any>; //显示 banner 广告。
		hide(): void; //隐藏 banner 广告
		destroy(): void; //销毁 banner 广告
		onResize(callback: (res: { width: number, height: number }) => void): void; //监听 banner 广告尺寸变化事件
		offResize(callback: () => void): void; //取消监听 banner 广告尺寸变化事件
		onLoad(callback: () => void): void; //监听 banner 广告加载事件
		offLoad(callback: () => void): void; //取消监听 banner 广告加载事件
		onError(callback: (res) => void): void; //监听 banner 广告错误事件
		offError(callback: () => void): void; //取消监听 banner 广告错误事件
	}
	// https://developers.weixin.qq.com/minigame/dev/api/ad/wx.createBannerAd.html
	function createBannerAd(object: { adUnitId: string, adIntervals?: number, style: bannerStyle }): BannerAd

	// https://developers.weixin.qq.com/minigame/dev/api/InnerAudioContext.html
	interface InnerAudioContext {
		// 音频资源的地址，用于直接播放。2.2.3 开始支持云文件ID
		src: string;
		// 开始播放的位置（单位：s），默认为 0
		startTime: number;
		// 是否自动开始播放，默认为 false
		autoplay: boolean;
		// 是否循环播放，默认为 false
		loop: boolean;
		// 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音
		obeyMuteSwitch: boolean;
		// 音量。范围 0~1。默认为 1, 基础库 1.9.90 开始支持，低版本需做兼容处理。
		volume: number;
		// 当前音频的长度（单位 s）。只有在当前有合法的 src 时返回（只读）
		duration: number;
		// 当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位（只读）
		currentTime: number;
		// 当前是是否暂停或停止状态（只读）
		paused: boolean;
		// 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲（只读）
		buffered: number;

		// 播放
		play(): void;
		// 暂停。暂停后的音频再播放会从暂停处开始播放
		pause(): void;
		// 停止。停止后的音频再播放会从头开始播放。
		stop(): void;
		// 跳转到指定位置。position：跳转的时间，单位 s。精确到小数点后 3 位，即支持 ms 级别精确度
		seek(position: number): void;
		// 销毁当前实例
		destroy(): void;

		// 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
		onCanplay(callback: () => void): void;
		// 取消监听音频进入可以播放状态的事件
		offCanplay(callback: () => void): void;
		// 监听音频播放事件
		onPlay(callback: () => void): void;
		// 取消监听音频播放事件
		offPlay(callback: () => void): void;
		// 监听音频暂停事件
		onPause(callback: () => void): void;
		// 取消监听音频暂停事件
		offPause(callback: () => void): void;
		// 监听音频停止事件
		onStop(callback: () => void): void;
		// 取消监听音频停止事件
		offStop(callback: () => void): void;
		// 监听音频自然播放至结束的事件
		onEnded(callback: () => void): void;
		// 取消监听音频自然播放至结束的事件
		offEnded(callback: () => void): void;
		// 监听音频播放进度更新事件
		onTimeUpdate(callback: () => void): void;
		// 取消监听音频播放进度更新事件
		offTimeUpdate(callback: () => void): void;
		// 监听音频播放错误事件。errCode：10001 系统错误，10002 网络错误，10003 文件错误，10004 格式错误，-1 未知错误
		onError(callback: (res: { errCode: number }) => void): void;
		// 取消监听音频播放错误事件
		offError(callback: (res: { errCode: number }) => void): void;
		// 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
		onWaiting(callback: () => void): void;
		// 取消监听音频加载中事件
		offWaiting(callback: () => void): void;
		// 监听音频进行跳转操作的事件
		onSeeking(callback: () => void): void;
		// 取消监听音频进行跳转操作的事件
		offSeeking(callback: () => void): void;
		// 监听音频完成跳转操作的事件
		onSeeked(callback: () => void): void;
		// 取消监听音频完成跳转操作的事件
		offSeeked(callback: () => void): void;
	}
	/**
	 * 创建并返回内部 audio 上下文 `innerAudioContext` 对象。*本接口是 `wx.createAudioContext` 升级版。*
	 */
	export function createInnerAudioContext(): InnerAudioContext;

	interface WXConfig {
		// 插件配置
		plugins?: { cocos: {provider: "wx7095f7fa398a2f30", version: "2.4.5", path: "cocos"} }	// 开发者工具独有
		pages?: any[];	// 开发者工具独有

		// 游戏的appid、图标和游戏名，例：{ appId: "wxa3b9a0e81caf23b2", nickname: "边锋干瞪眼", icon: "http://wx.qlogo.cn/mmhead/..." }
		accountInfo: { appId: string, icon: string, nickname: string };

		// 启动信息
		appLaunchInfo: {
			path: "index.html",
			query: { [key: string]: string },
			scene: number,	// 1089
			referrerInfo?: { appId?: string, extraData?: { [key: string]: any } },
			shareTicket: undefined,

			// 开发者工具、iOS、PC没有
			scene_note?: string,	// https://mp.weixin.qq.com/a?username=gh_30cd0ca49988@app&path=&debug=1&qr_type4wxa=1&codeurl=https://servicewechat.com/weapp-test/debug/gtmEzJwzy_r5PQn3BLLxERHzYBGjOTc4GamnvOPgnPA&md5=4cea21381ee1e88205e2b4f2115971df&test_lifespan=7200&json_extinfo={"module_list":[],"dev_key":768351640,"device_orientation":"landscape","open_remote":false,"room_id":"","wxpkg_info":"","qrcode_id":0,"remote_network_type":0,"remote_proxy_port":0,"disable_url_check":false,"remote_support_compress_algo":0,"loading_image_info":{},"data_type_declarations":[],"wxacode_lib_info_list":[],"without_lib_md5":""}&appid=wxa3b9a0e81caf23b2&lang=zh_CN&devicetype=android-25
			sessionId?: string	// "hash=126590226&ts=1618197075126&host=&version=671089211&device=2" "SessionId@152227019#1546484165564"
			usedState?: number	// 2
			prescene?: number,	// 0
			prescene_note?: string,	// ""
			referpagepath?: "",
			transitExtraData?: {},
			appversion?: number,	// 0
			mode?: string	// "default",
			referpagepath?: "",
			clickTimestamp?: 1546484168273,
		};

		appType: number;	// 4
		deprecated: true;
		env: {
			USER_DATA_PATH: "wxfile://usr"

			// 开发者工具、iOS、PC没有
			HAS_SPLASHSCREEN?: 0
			CLIENT_DATA_PATH?: "wxfile://clientdata"
			OPEN_DATA_PATH?: "wxfile://opendata"
		};
		envVersion: string;	// "develop"（开发版），"trial"（体验版），"release"（正式版）

		// 网络超时配置, 例：{ connectSocket: 10000, downloadFile: 10000, request: 10000, uploadFile: 10000 }
		networkTimeout: { connectSocket: number, downloadFile: number, request: number, uploadFile: number };

		page: {};
		platform: string;	// "android"/"ios"/"devtools"

		wxAppInfo: {
			maxDownloadConcurrent: 10,
			maxRequestConcurrent: 10,
			maxUploadConcurrent: 10,
			maxWebsocketConcurrent: 5,
			maxWorkerConcurrent: 1,

			// 开发者工具没有
			subContextImgDomain?: [
				"https://wx.qlogo.cn/",
				"https://thirdwx.qlogo.cn/"
			]
		}

		// （已经没了）可跳转的小游戏的AppId列表, 例：["wx1764b6802117c5df", "wx57ae94054294d843", "wx5581108ae671297a", ...]
		// navigateToMiniProgramAppIdList: string[];

		// 下面都是开发者工具没有的
		system: string; 	// "Android 7.1.1"/"iOS 14.5"

		// 下面都是开发者工具、PC没有的
		host?: {
			env: "WeChat",
			appId?: "",
			version: number	// 402654252
		};

		// 下面都是开发者工具、iOS、PC没有的

		// 插件配置
		gamePlugins?: { cocos: {path: "cocos", provider: "wx7095f7fa398a2f30", version: "2.4.5"} };	// 安卓手机独有

		showStatusBar: string | boolean; // 是否显示状态栏，可能是字符串，例："false"
		statusBarHeight: 35;
		menuButtonInfo: { viewId: 1, zIndex: 1000 };
		language?: "zh_CN";
		resizable: true;
		openDataContext: "openDataContext/";	// 开放数据域路径，例："./openDataContext"
		subContext: "openDataContext/";	// 子域路径，例："./openDataContext"
		subPackages: string[];
		opConfig: { expt_info: {} };
		preload?: boolean;	// true
		preloadType: 110;
		prerender: boolean;
		supportAsyncAudio: true;
		supportAsyncGetSystemInfo: true;
		useClipboardWithPermissionNotify: true;
		useXWebVideo?: boolean;	// false
		XWebVideoMinVersion: number;	// 300
		nativeBufferEnabled?: boolean;	// true
		isPluginMiniProgram?: boolean;	// false

		version: "8.0.3";
		debug?: boolean; // true
		clientVersion?: number;	// 637993789
		JSEngineName?: string;	// "J2V8-Package"/"NodeJS"
		instanceId?: "hash=768351640&ts=1619762262790&host=&version=671089463&device=2";
		onReadyStart?: number// 1546484168310
		isReady?: boolean;	// true
		isSubContext?: boolean;	// false
		isIsolateContext?: boolean;	// true

		// 屏幕分辨率和DPR
		screenWidth?: number;		// 640
		screenHeight?: number;		// 360
		deviceOrientation?: string;	// 屏幕方向，例："landscape"
		devicePixelRatio?: number;	// 3
		pixelRatio?: number;	// 3
		model: "Redmi K30 Pro";
		safeArea: "{width=873, right=873, top=0, left=0, bottom=393, height=393}";
		brand: string;	// 设备品牌，如"Redmi"

		// 启动信息
		debugLaunchInfo: {
			path: "",
			query: { [key: string]: string },
			scene: number,	// 1089
		}

		appContactInfo?: {
			call_plugin_info: [
				{
					contexts: any[],
					inner_version: 25,
					md5_list: any[],
					plugin_id: "wx7095f7fa398a2f30",
					plugin_version: 2004005
				}
			]
			operationInfo: {
				jsonInfo: {
					apiAvailable: {
						authorize: 0,
						gameSceneFromMyApp: 0,
						getUserInfo: 0,
						h5PayDisableForward: 0,
						navigateToMiniProgram: 1,
						navigateToMiniProgramConfig: 0,
						openSetting: 0,
						screenCanvasReadPixelsFreely: 0,
						share: 0,
						shareCustomImageUrl: 1
					},
					bgKeepAlive: { music: 0 },
					jumpWeAppFromLongPressCodeBanInfo: { banJumpApp: 0, banJumpGame: 0 },
					misc_ban_info: { minigame_freeze_status: 0 },
					navigate_ban_info: { do_report: 0, navigate_ban_rule_list: any[] },
					op_info: { grow_protect: 1 },
					privacy: { banGetWifiListIfEmptyDesc: 1, banLocationIfEmptyDesc: 1 },
					warning_info: { jsapi_alter: any[] }
				}
			},
			passThroughInfo: {
				expt_info: { expt_param_list: any[] },
				forceUpdate: false,
				openProductFlag: 0
			}
		};
	}

	// https://developers.weixin.qq.com/minigame/dev/api/wx.requestMidasPayment.html
	interface MidasPayment extends WXCallObject<{}> {
		mode: string;//		是	支付的类型，不同的支付类型有各自额外要传的附加参数。
		env?: number;//	0	否	环境配置
		offerId: string;//		是	在米大师侧申请的应用 id	
		currencyType: string;//		是	币种	
		platform?: string;//		否	申请接入时的平台，platform 与应用id有关。
		buyQuantity: number;//		否	购买数量。mode = game 时必填。购买数量。详见 buyQuantity 限制说明。
		zoneId?: string;//	1	否	分区 ID	
	}
	// https://q.qq.com/wiki/develop/game/API/payment/qq.requestMidasPayment.html
	interface QQMidasPayment extends WXCallObject<{}> {
		prepayId?: string;	// 是	商品预下单获取的预下单id
		starCurrency: number	// 是	金币数 商品预下单时填写的金币数量
	}

	function requestMidasPayment(config: MidasPayment | QQMidasPayment): void;
	/**
	 * 需要在game.js里重命名才能用：
	 * require("weapp-adapter.js");
	 * window.wx && (window.wx.requestKejin = window.wx.requestMidasPayment);
	 * require("./code.js");
	 */
	function requestKejin(config: MidasPayment | QQMidasPayment): void;

	// https://developers.weixin.qq.com/minigame/dev/api/wx.showKeyboard.html
	interface _ShowKeyboardObject extends WXCallObject<{}> {
		defaultValue: string;	// 键盘输入框显示的默认值
		maxLength: number;	// 键盘中文本的最大长度
		multiple: boolean;	// 是否为多行输入
		confirmHold: boolean;	// 当点击完成时键盘是否收起
		confirmType: string;	// 键盘右下角 confirm 按钮的类型，只影响按钮的文本内容:done/next/search/go/send
	}
	function showKeyboard(object: _ShowKeyboardObject): void

	// https://developers.weixin.qq.com/minigame/dev/api/wx.updateKeyboard.html
	interface _UpdateKeyboardObject extends WXCallObject<{}> {
		value: string;	// 键盘输入框的当前值
	}
	function updateKeyboard(object: _UpdateKeyboardObject): void

	// https://developers.weixin.qq.com/minigame/dev/api/wx.hideKeyboard.html
	interface _HideKeyboardObject extends WXCallObject<{}> { }
	function hideKeyboard(object?: _HideKeyboardObject): void

	function onKeyboardComplete(callback: (res: { value: string }) => void): void
	function offKeyboardComplete(callback: (res: { value: string }) => void): void
	function onKeyboardConfirm(callback: (res: { value: string }) => void): void
	function offKeyboardConfirm(callback: (res: { value: string }) => void): void
	function onKeyboardInput(callback: (res: { value: string }) => void): void
	function offKeyboardInput(callback: (res: { value: string }) => void): void

	// https://developers.weixin.qq.com/minigame/dev/api/wx.setKeepScreenOn.html
	interface _SetKeepScreenOnObject extends WXCallObject<{}> {
		keepScreenOn: boolean;	// 是否保持屏幕常亮
	}
	function setKeepScreenOn(object: _SetKeepScreenOnObject): void

	// https://developers.weixin.qq.com/minigame/dev/api/base/app/app-event/wx.onError.html
	function onError(callback: (res: { message: string, stack: string }) => void): void
	function offError(callback: (res: { message: string, stack: string }) => void): void
	function onAudioInterruptionBegin(callback: () => void): void
	function offAudioInterruptionBegin(callback: () => void): void
	function onAudioInterruptionEnd(callback: () => void): void
	function offAudioInterruptionEnd(callback: () => void): void

	// https://developers.weixin.qq.com/minigame/dev/api/device/performance/wx.onMemoryWarning.html
	function onMemoryWarning(callback: (res: { level?: number }) => void): void

	function triggerGC(): void

	interface GetShareInfoSuccessObject {
		encryptedData: string;	// 包括敏感数据在内的完整转发信息的加密数据，详细见[加密数据解密算法](./signature.md#加密数据解密算法)
		iv: string;	// 加密算法的初始向量，详细见[加密数据解密算法](./signature.md#加密数据解密算法)
		cloudID: string;	// 敏感数据对应的云 ID，开通云开发的小程序才会返回，可通过云调用直接获取开放数据，详细见云调用直接获取开放数据
	}
	interface GetShareInfoObject extends WXCallObject<GetShareInfoSuccessObject> {
		shareTicket: string;
		timeout?: number;
	}
	// https://developers.weixin.qq.com/minigame/dev/api/wx.getShareInfo.html
	function getShareInfo(object: GetShareInfoObject): void;

	// https://developers.weixin.qq.com/minigame/dev/api/wx.navigateToMiniProgram.html
	interface _NavigateToMiniProgramObject extends WXCallObject<{ errMsg: string }> {
		appId: string;
		path?: string;
		extraData?: Object;
		envVersion?: string;
	}
	function navigateToMiniProgram(object: _NavigateToMiniProgramObject): void;

	//https://developers.weixin.qq.com/minigame/dev/api/FileSystemManager.html
	interface ReadFileObject extends WXCallObject<{ data: string | ArrayBuffer }> {
		// 要读取的文件的路径 (本地路径)
		filePath: string;
		// 指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容
		encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "ucs-2" | "utf16le" | "utf-16le" | "utf8" | "utf-8" | "latin1";
		// 从文件指定位置开始读，如果不指定，则从文件头开始读。读取的范围应该是左闭右开区间 [position, position+length)。有效范围：[0, fileLength - 1]。单位：byte
		position?: number;
		// 指定文件的长度，如果不指定，则读到文件末尾。有效范围：[1, fileLength]。单位：byte
		length?: number;
	}
	interface ReadDirObject extends WXCallObject<{ files: string[] }> {
		dirPath: string;
	}
	interface RemoveDirObject extends WXCallObject<{}> {
		dirPath: string;
		recursive?: boolean;	// false
	}
	interface UnlinkObject extends WXCallObject<{}> {
		filePath: string;
	}
	interface GetFileInfoObject extends WXCallObject<{ size: number }> {
		filePath: string;
	}
	interface Stats {
		mode: string;	// 文件的类型和存取的权限，对应 POSIX stat.st_mode
		size: number;	// 文件大小，单位：B，对应 POSIX stat.st_size
		lastAccessedTime: number;	// 文件最近一次被存取或被执行的时间，UNIX 时间戳，对应 POSIX stat.st_atime
		lastModifiedTime: number;	// 文件最后一次被修改的时间，UNIX 时间戳，对应 POSIX stat.st_mtime
		isDirectory(): boolean;	// 判断当前文件是否一个目录
		isFile(): boolean;	// 判断当前文件是否一个普通文件
	}
	interface StatObject extends WXCallObject<{ stats: Stats | { path: string, stats: Stats }[] }> {
		path: string;
		recursive?: boolean;	// false
	}
	interface FileSystemManager {
		readFile(object: ReadFileObject): void;	// 读取本地文件内容
		readdir(object: ReadDirObject): void;	// 读取目录内文件列表
		rmdir(object: RemoveDirObject): void;	// 删除目录
		unlink(object: UnlinkObject): void;	// 删除文件

		stat(object: StatObject): void;	// 获取文件 Stats 对象
		getFileInfo(object: GetFileInfoObject): void;	// 获取文件大小

		getSavedFileList(object: WXCallObject<{}>): void;	// 删除文件
	}
	function getFileSystemManager(): FileSystemManager;

	export const env: { USER_DATA_PATH: string };	// "wxfile://usr"
	export const cloud: {
		callFunction: Function;
		database: Function;
		deleteFile: Function;
		downloadFile: Function;
		uploadFile: Function;
		getTempFileURL: Function;
		init: Function;
	};
	export const version: { updateTime: string, version: string };	// { updateTime: "2019.4.2 15:40:17", version: "2.6.5" }

	interface MuteConfigObject {
		muteMicrophone?: boolean;	//是否静音麦克风
		muteEarphone?: boolean;	//是否静音耳机
	}
	interface JoinVoIPChatObject extends WXCallObject<{ openIdList?: string[] }> {
		signature: string;		// 签名，用于验证小游戏的身份
		nonceStr: string;		// 验证所需的随机字符串
		timeStamp: number;		// 验证所需的时间戳
		groupId: string;		// 小游戏内此房间或群聊的 ID。同一时刻传入相同 groupId 的用户会进入到同个实时语音房间。
		muteConfig?: MuteConfigObject;		// 静音设置
	}
	// https://developers.weixin.qq.com/minigame/dev/api/media/voip/wx.joinVoIPChat.html
	function joinVoIPChat(object: JoinVoIPChatObject): void;		// 加入 (创建) 实时语音通话

	// https://developers.weixin.qq.com/minigame/dev/api/media/voip/wx.exitVoIPChat.html
	function exitVoIPChat(object: WXCallObject<{}>): void;		// 退出（销毁）实时语音通话

	interface UpdateVoIPChatMuteConfigObject extends WXCallObject<{}> {
		muteConfig: MuteConfigObject;		// 静音设置
	}
	// https://developers.weixin.qq.com/minigame/dev/api/media/voip/wx.updateVoIPChatMuteConfig.html
	function updateVoIPChatMuteConfig(object: UpdateVoIPChatMuteConfigObject): void;		// 更新实时语音静音设置
	function onVoIPChatInterrupted(callback: (res: { errCode: number, errMsg: string }) => void): void;  // 监听被动断开实时语音通话事件。包括小游戏切入后端时断开
	function onVoIPChatMembersChanged(callback: (res: { openIdList: string[], errCode: number, errMsg: string }) => void): void;  // 监听实时语音通话成员在线状态变化事件。有成员加入/退出通话时触发回调
	function onVoIPChatSpeakersChanged(callback: (res: { openIdList: string[], errCode: number, errMsg: string }) => void): void;// 监听实时语音通话成员通话状态变化事件。有成员开始 / 停止说话时触发回调

	// https://developers.weixin.qq.com/minigame/dev/api/media/recorder/RecorderManager.html
	interface RecorderManager {
		// 开始录音
		start(object: StartRecordObject): void;
		// 暂停录音
		pause();
		// 继续录音
		resume();
		// 停止录音
		stop();
		// 监听录音开始事件
		onStart(callback: () => void);
		// 监听录音继续事件
		onResume(callback: () => void);
		// 监听录音暂停事件
		onPause(callback: () => void);
		// 监听录音结束事件
		onStop(callback: (res: {tempFilePath: string, duration: number, fileSize: number}) => void);
		// 监听已录制完指定帧大小的文件事件。如果设置了 frameSize，则会回调此事件。
		onFrameRecorded(callback: (res: {frameBuffer: ArrayBuffer, isLastFrame: boolean}) => void);
		// 监听录音错误事件
		onError(callback: (res: {errMsg: string}) => void);
		// 监听录音因为受到系统占用而被中断开始事件。以下场景会触发此事件：微信语音聊天、微信视频聊天。此事件触发后，录音会被暂停。pause 事件在此事件后触发
		onInterruptionBegin(callback: () => void);
		// 监听录音中断结束事件。在收到 interruptionBegin 事件之后，小程序内所有录音会暂停，收到此事件之后才可再次录音成功。
		onInterruptionEnd(callback: () => void);
	}
	// https://developers.weixin.qq.com/minigame/dev/api/media/recorder/RecorderManager.start.html
	interface StartRecordObject {
		duration?: number; //	录音的时长，单位 ms，最大值 600000（10 分钟），默认60000
		sampleRate?: 8000 | 11025 | 12000 | 16000 | 22050 | 24000 | 32000 | 44100 | 48000; //	采样率，默认8000
		numberOfChannels?: 1 | 2; //	录音通道数，默认2
		encodeBitRate?: number; //	编码码率，有效值见表格，默认48000
		format?: "mp3" | "aac" | "wav" | "PCM"; //		音频格式，默认"aac"
		frameSize?: number; //		指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。
		//	指定录音的音频输入源，可通过 wx.getAvailableAudioSources() 获取当前可用的音频源，默认"auto"，最低版本2.1.0
		audioSource?: "auto" | "buildInMic" | "headsetMic" | "mic" | "camcorder" | "voice_communication" | "voice_recognition";
	}
	// https://developers.weixin.qq.com/minigame/dev/api/media/recorder/wx.getRecorderManager.html
	function getRecorderManager(): RecorderManager;		// 获取全局唯一的录音管理器 RecorderManager

	interface FeedbackButton {
		type: string;	// "text" | "image"
		text: string;
		image: string;
		style: ButtonStyle;
		show(): void;
		hide(): void;
		destroy(): void;
		onTap(callback: (res: GetUserInfoSuccessObject) => void): void
		offTap(callback: () => void): void
	}
	interface CreateFeedbackButtonObject {
		type: string;	// "text" | "image"
		text?: string;
		image?: string;
		style: ButtonStyle;
	}
	// https://developers.weixin.qq.com/minigame/dev/api/open-api/feedback/wx.createFeedbackButton.html
	function createFeedbackButton(info: CreateFeedbackButtonObject): FeedbackButton;

	// https://wximg.qq.com/wxp/pdftool/get.html?post_id=751
	interface InterstitialAd {
		show(): Promise<any>;
		onLoad(callback: () => void): void;
		offLoad(callback: () => void): void;

		onError(callback: (err: { errMsg: string, errCode: number }) => void): void;
		offError(callback: (err: { errMsg: string, errCode: number }) => void): void;
		onClose(callback: (res: { isEnded: boolean }) => void): void;
		offClose(callback: (res: { isEnded: boolean }) => void): void;
	}
	function createInterstitialAd(object: { adUnitId: string }): InterstitialAd;

	// 小游戏推荐banner组件 https://developers.weixin.qq.com/minigame/dev/api/game-portal/GameBanner.html
	interface GameBanner {
		isDestroyed: boolean;	//	是否已销毁的标记位
		style: {
			left: number;	// 小游戏推荐banner组件的左上角横坐标
			top: number;	// 小游戏推荐banner组件的左上角纵坐标
			width?: number;
			height?: number;
		};
		show(): Promise<any>;
		hide(): Promise<any>; //隐藏 GameBanner 广告
		destroy(): Promise<any>; //销毁 GameBanner 广告
		onResize(callback: (left: number, top: number, width: number, height: number) => void): void; //监听 GameBanner 广告尺寸变化事件
		offResize(callback: () => void): void; //取消监听 GameBanner 广告尺寸变化事件
		onLoad(callback: () => void): void; //监听 GameBanner 广告加载事件
		offLoad(callback: () => void): void; //取消监听 GameBanner 广告加载事件
		onError(callback: (res) => void): void; //监听 GameBanner 广告错误事件
		offError(callback: () => void): void; //取消监听 GameBanner 广告错误事件
	}
	interface _gameBannerData {
		adUnitId: string;	// 是	推荐单元 id
		style: {
			left: number;	// 小游戏推荐banner组件的左上角横坐标
			top: number;	// 小游戏推荐banner组件的左上角纵坐标
		};	//	是	小游戏推荐banner组件样式
	}
	function createGameBanner(obj: _gameBannerData): GameBanner;

	// 小游戏推荐弹窗组件 https://developers.weixin.qq.com/minigame/dev/api/game-portal/GamePortal.html
	interface GamePortal {
		isDestroyed: boolean;	//	是否已销毁的标记位
		style: {
			left: number;	// 小游戏推荐弹窗组件的左上角横坐标
			top: number;	// 小游戏推荐弹窗组件的左上角纵坐标
		};
		load(): Promise<any>; //加载 GamePortal 广告
		show(): Promise<any>;
		destroy(): Promise<any>; //销毁 GamePortal 广告
		onLoad(callback: () => void): void; //监听 GamePortal 广告加载事件
		offLoad(callback: () => void): void; //取消监听 GamePortal 广告加载事件
		onError(callback: (res) => void): void; //监听 GamePortal 广告错误事件
		offError(callback: () => void): void; //取消监听 GamePortal 广告错误事件
		onClose(callback: (res) => void): void; //监听 GamePortal 广告关闭事件
		offClose(callback: () => void): void; //取消监听 GamePortal 广告关闭事件
	}
	function createGamePortal(obj: { adUnitId: string }): GamePortal;

	interface OpenCustomerServiceConversationObject extends WXCallObject<{}> {
		sessionFrom?: string;	//	否	会话来源
		showMessageCard?: boolean;	//	false	否	是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息
		sendMessageTitle?: string;	//	''	否	会话内消息卡片标题
		sendMessagePath?: string;	//	''	否	会话内消息卡片路径
		sendMessageImg?: string;	//	''	否	会话内消息卡片图片路径
	}
	// https://developers.weixin.qq.com/minigame/dev/api/open-api/customer-message/wx.openCustomerServiceConversation.html
	function openCustomerServiceConversation(object: OpenCustomerServiceConversationObject): void;

	// https://developers.weixin.qq.com/minigame/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html
	interface SubscribeObject extends WXCallObject<{ [TEMPLATE_ID: string]: string }> {
		tmplIds: string[];
		//[TEMPLATE_ID]是动态的键，即模板id，值包括'accept'、'reject'、'ban'。
		// 'accept'表示用户同意订阅该条id对应的模板消息，'reject'表示用户拒绝订阅该条id对应的模板消息，'ban'表示已被后台封禁。
		// 例如 { errMsg: "requestSubscribeMessage:ok", zun - LzcQyW - edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: "accept" } 表示用户同意订阅zun - LzcQyW - edafCVvzPkK4de2Rllr1fFpw2A_x0oXE这条消息
	}
	function requestSubscribeMessage(object: SubscribeObject): void;

	// https://developers.weixin.qq.com/community/develop/doc/000ecccb440220c39a5a67dfe5b409
	// msgType: 1-游戏更新提醒，目前只有这种类型
	// confirm: 取消的时候走success回调且confirm为false
	// errCode: 1-系统错误, 2-用户已订阅该类型消息, 3-超过频率限制,暂时不允许发起订阅, 4-没有权限或已封禁
	function requestSubscribeWhatsNew(object: { msgType: number } & WXCallObject<{ confirm: boolean }>): void;
	// https://developers.weixin.qq.com/community/develop/doc/000ecccb440220c39a5a67dfe5b409
	// msgType: 1-游戏更新提醒，目前只有这种类型
	// status: 1-未订阅,可以发起订阅, 2-用户已订阅该类型消息, 3-超过频率限制,暂时不允许发起订阅, 4-没有权限或已封禁
	function getWhatsNewSubscriptionsSetting(object: { msgType: number } & WXCallObject<{ status: number }>): void;

	// https://developers.weixin.qq.com/minigame/dev/api/device/touch-event/Touch.html
	interface Touch {
		identifier: number;
		pageX: number;
		pageY: number;
		clientX: number;
		clientY: number;
	}
	interface TouchEvent {
		type: "touchstart" | "touchmove" | "touchend" | "touchcancel";
		touches: Touch[];
		changedTouches: Touch[];
		timeStamp: number;
	}
	// https://developers.weixin.qq.com/minigame/dev/api/device/touch-event/wx.onTouchStart.html
	function onTouchStart(callback: (event: TouchEvent) => void): void;
	function offTouchStart(callback: (event: TouchEvent) => void): void;
	// https://developers.weixin.qq.com/minigame/dev/api/device/touch-event/wx.onTouchMove.html
	function onTouchMove(callback: (event: TouchEvent) => void): void;
	function offTouchMove(callback: (event: TouchEvent) => void): void;
	// https://developers.weixin.qq.com/minigame/dev/api/device/touch-event/wx.onTouchEnd.html
	function onTouchEnd(callback: (event: TouchEvent) => void): void;
	function offTouchEnd(callback: (event: TouchEvent) => void): void;
	// https://developers.weixin.qq.com/minigame/dev/api/device/touch-event/wx.onTouchCancel.html
	function onTouchCancel(callback: (event: TouchEvent) => void): void;
	function offTouchCancel(callback: (event: TouchEvent) => void): void;

	interface GridAdStyle {
		left?: number,//	grid(格子) 广告组件的左上角横坐标
		top?: number,//		grid(格子) 广告组件的左上角纵坐标
		width?: number,//	grid(格子) 广告组件的宽度。最小 300，最大至 屏幕宽度（屏幕宽度可以通过 wx.getSystemInfoSync() 获取）。
		height?: number,//	grid(格子) 广告组件的高度
		realWidth?: number,//	grid(格子) 广告组件经过缩放后真实的宽度
		realHeight?: number,//	grid(格子) 广告组件经过缩放后真实的高度
	}
	interface GridAd {
		style: GridAdStyle;
		adTheme: string;	// grid(格子) 广告广告组件的主题，提供 white black 两种主题选择
		gridCount: number;	// grid(格子) 广告组件的格子个数，可设置爱5，8两种格子个数样式，默认值为5
		show(): Promise<any>; //显示 grid(格子) 广告。
		hide(): void; //隐藏 grid(格子) 广告
		destroy(): void; //销毁 grid(格子) 广告
		onResize(callback: (res) => void): void; //监听 grid(格子) 广告尺寸变化事件
		offResize(callback: () => void): void; //取消监听 grid(格子) 广告尺寸变化事件
		onLoad(callback: () => void): void; //监听 grid(格子) 广告加载事件
		offLoad(callback: () => void): void; //取消监听 grid(格子) 广告加载事件
		onError(callback: (res) => void): void; //监听 grid(格子) 广告错误事件
		offError(callback: () => void): void; //取消监听 grid(格子) 广告错误事件
	}
	interface GridAdObj {
		adUnitId: string;	//		是	广告单元 id
		adIntervals?: number;	//		否	广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（该参数不传入时 grid(格子) 广告不会自动刷新）
		style: Object;	//		是	grid(格子) 广告组件的样式
		adTheme: string;	//		是	grid(格子) 广告广告组件的主题，提供 white black 两种主题选择。
		gridCount: number;	//		是	grid(格子) 广告组件的格子个数，可设置爱5，8两种格子个数样式，默认值为5
	}
	function createGridAd(object: GridAdObj): GridAd;

	// https://developers.weixin.qq.com/minigame/dev/api/share/wx.setMessageToFriendQuery.html
	function setMessageToFriendQuery({shareMessageToFriendScene: number}): boolean;
	// https://developers.weixin.qq.com/minigame/dev/api/share/wx.onShareMessageToFriend.html
	function onShareMessageToFriend(callback: (res: {success: boolean, errMsg: string}) => void): void;

	// wifi wifi网络
	// 2g 2g网络
	// 3g 3g网络
	// 4g 4g网络
	// 5g 5g网络
	// unknown Android下不常见的网络类型
	// none 无网络
	function getNetworkType(object: WXCallObject<{ networkType: string }>);	//
	function onNetworkStatusChange(callback: (res: { isConnected: boolean, networkType: string }) => void);

	// https://developers.weixin.qq.com/minigame/dev/api/game-recorder/GameRecorder.html
	interface GameRecorder {
		isFrameSupported(): boolean; // 获取是否支持录制游戏画面
		isSoundSupported(): boolean;	// 获取是否在录制游戏画面的同时支持录制游戏音频的信息
		isVolumeSupported(): boolean;	// 获取是否支持调节录制视频的音量
		isAtempoSupported(): boolean;	// 获取是否支持调节录制视频的播放速率
		start(object: wx.GameRecorderStartObj);	// 开始录制游戏画面
		stop(): Promise<void>;	// 结束录制游戏画面。结束录制后可以发起分享。
		pause(): Promise<void>;	// 暂停录制游戏画面。
		resume(): Promise<void>;	// 恢复录制游戏画面。
		abort(): Promise<void>;	// 放弃录制游戏画面。此时已经录制的内容会被丢弃。
		on(event: string, callback: (res) => void): void;	// 注册监听录制事件的回调函数。当对应事件触发时，回调函数会被执行。
		off(event: string, callback: () => void): void;	// 取消监听录制事件。当对应事件触发时，该回调函数不再执行。
	}
	interface GameRecorderStartObj {
		fps?: number;	//	24	否	视频 fps
		duration?: number;	//	7200	否	视频的时长限制，单位为秒（s）。最大值 7200，最小值 5，到达指定时长后不会再录入。但还需要手动调用 GameRecorder.stop() 来结束录制。
		bitrate?: number;	//	1000	否	视频比特率（kbps），默认值1000，最大值 3000，最小值 600
		gop?: number;	//	12	否	视频关键帧间隔
		hookBgm?: boolean;	//	false	否	是否录制游戏音效
	}
	function getGameRecorder(): GameRecorder;
	interface GameRecorderShareButton {
		style: GameRecorderShareButtonStyle;	//
		icon: string;	// 图标的 url。支持 http/https 开头的网络资源和 wxfile:// 开头的本地资源。如果不设置则使用默认图标。
		image: string;	// 按钮的背景图片的 url。支持 http/https 开头的网络资源和 wxfile:// 开头的本地资源。如果不设置则使用默认图标。
		text: string;	// 按钮的文本。
		share: GameRecorderShareData;
		show(): void;	// 显示游戏对局回放分享按钮
		hide(): void;	// 隐藏游戏对局回放分享按钮
		onTap(callback: (res) => void): void;	// 监听游戏对局回放分享按钮的点击事件。只有当分享由于非用户取消的原因失败时，该事件的回调函数才会执行。
		offTap(callback: () => void): void;	// 取消监听游戏对局回放分享按钮的点击事件
	}
	interface GameRecorderShareData {
		query: string;	//	分享的对局回放打开后跳转小游戏的 query。
		title?: GameRecorderShareTitleData;	//	对局回放的标题的配置。对局回放标题不能随意设置，只能选择预设的文案模版和对应的参数。
		button?: {
			template: string; // 合法值： enter--马上玩  challenge--去挑战  play--去挑战
		};	//	对局回放的按钮的配置。对局回放按钮的文案不能随意设置，只能选择预设的文案模版。
		bgm: string;	//	对局回放背景音乐的地址。必须是一个代码包文件路径或者 wxfile:// 文件路径，不支持 http/https 开头的 url。
		timeRange: number[][];	//	对局回放的剪辑区间，是一个二维数组，单位 ms（毫秒）。[[1000, 3000], [4000, 5000]] 表示剪辑已录制对局回放的 1-3 秒和 4-5 秒最终合成为一个 3 秒的对局回放。对局回放剪辑后的总时长最多 60 秒，即 1 分钟。
		volume?: number;	//	对局回放的音量大小，最小 0，最大 1。	2.9.2
		atempo?: number;	//	对局回放的播放速率，只能设置以下几个值：0.3，0.5，1，1.5，2，2.5，3。其中1表示原速播放，小于1表示减速播放，大于1表示加速播放。	2.9.2
		audioMix?: boolean;	//	如果原始视频文件中有音频，是否与新传入的bgm混音，默认为false，表示不混音，只保留一个音轨，值为true时表示原始音频与传入的bgm混音。
	}
	interface GameRecorderShareTitleData {
		template: string; //	对局回放的标题的模版。不传则为：${用户昵称} 在 ${游戏名称} 的游戏时刻
		// 合法值如下：
		// default.score	模版格式为，《小游戏名称》，本局得分：${score}，对应的 data 应该如 { score: 4500 }
		// default.level	模版格式为，《小游戏名称》，当前关卡：第42关，对应的 data 应该如 { level: 23 }
		// default.opponent	模版格式为，《小游戏名称》，本局对手：${opponent}，对应的 data 应该如 { opponent_openid: 'oC6J75Sh1_4K8Mf5b1mlgDkMPhoI' }
		// default.cost	模版格式为，《小游戏名称》，本局耗时：${cost}秒，对应的 data 应该如 { cost_seconds: 123 }
		data: Object; //	对局回放的标题的模版参数。
	}
	function createGameRecorderShareButton(object: GameRecorderShareButtonData): GameRecorderShareButton;
	interface GameRecorderShareButtonData {
		style: GameRecorderShareButtonStyle;	//		是	按钮的样式
		icon?: string;	//		否	图标的 url。支持 http/https 开头的网络资源和 wxfile:// 开头的本地资源。如果不设置则使用默认图标。
		image?: string;	//		否	按钮的背景图片的 url。支持 http/https 开头的网络资源和 wxfile:// 开头的本地资源。如果不设置则使用默认图标。
		text?: string;	//		否	按钮的文本。
		share: GameRecorderShareData;	//		是	对局回放的分享参数。
	}
	interface GameRecorderShareButtonStyle {
		left?: number;	//	0	否	左上角横坐标，单位 逻辑像素
		top?: number;	//	0	否	左上角纵坐标，单位 逻辑像素
		height?: number;	//	40	否	按钮的高度，最小 40 逻辑像素
		iconMarginRight?: number;	//	8	否	图标和文本之间的距离，最小 8 逻辑像素
		fontSize?: number;	//	17	否	文本的字体大小。最小 17，最大 22。
		color?: string;	//	#ffffff	否	文本的颜色。
		paddingLeft?: number;	//	16	否	按钮的左内边距，最小 16 逻辑像素。
		paddingRight?: number;	//	16	否	按钮的右内边距，最小 16 逻辑像素。
	}

	// https://developers.weixin.qq.com/minigame/dev/api/base/debug/LogManager.html
	interface LogManager {
		debug(message?: any, ...optionalParams: any[]): void;
		info(message?: any, ...optionalParams: any[]): void;
		log(message?: any, ...optionalParams: any[]): void;
		warn(message?: any, ...optionalParams: any[]): void;
	}
	// 取值为0/1，0表示是否会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志，取值为1则不会。默认值是 0
	function getLogManager(object: { level?: number }): LogManager;

	// https://developers.weixin.qq.com/minigame/dev/api/base/debug/wx.setEnableDebug.html
	function setEnableDebug(object: { enableDebug: boolean }): void;

	// https://developers.weixin.qq.com/minigame/dev/api/device/battery/wx.getBatteryInfo.html
	interface BatteryObject extends WXCallObject<{ level: number, isCharging: boolean }> { }
	function getBatteryInfo(object: BatteryObject): void;

	interface _menuButtonBoundingClientRectData {
		width: number;	// 宽度，单位：px
		height: number;	// 高度，单位：px
		top: number;	// 上边界坐标，单位：px
		right: number;	// 右边界坐标，单位：px
		bottom: number;	// 下边界坐标，单位：px
		left: number;	// 左边界坐标，单位：px
	}
	function getMenuButtonBoundingClientRect(): wx._menuButtonBoundingClientRectData;

	interface Image extends HTMLImageElement {
		src: string;	//	图片的 URL
		width: number;	// 图片的真实宽度
		height: number;	// 图片的真实高度
		complete: boolean;	// 是否加载完成
		onload: (event: Event) => void;	// 图片加载完成后触发的回调函数
		onerror: (event: Event) => void;//	图片加载发生错误后触发的回调函数
	}
	// https://developers.weixin.qq.com/minigame/dev/api/render/image/wx.createImage.html
	function createImage(): Image;

	interface ReportUserBehaviorBranchAnalyticsObject {
		branchId: string;
		branchDim?: string;
		eventType: number;
	}
	// https://developers.weixin.qq.com/minigame/dev/api/open-api/report/wx.reportUserBehaviorBranchAnalytics.html
	function reportUserBehaviorBranchAnalytics(object: ReportUserBehaviorBranchAnalyticsObject): void;

	// https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html
	interface LocationData {
		latitude: number;	//	纬度，范围为 -90~90，负数表示南纬
		longitude: number;	// 经度，范围为 -180~180，负数表示西经
		speed: number;	// 速度，单位 m/s
		accuracy: number;	// 位置的精确度
		altitude: number;	// 高度，单位 m
		verticalAccuracy: number;	// 垂直精度，单位 m（Android 无法获取，返回 0）
		horizontalAccuracy: number;	// 水平精度，单位 m
	}
	interface GetLocationObject extends WXCallObject<LocationData> {
		type?: "wgs84";	//	wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
		altitude?: false;	// 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
		isHighAccuracy?: false;	// 开启高精度定位
		highAccuracyExpireTime?: number;	// 高精度定位超时时间(ms)，指定时间内返回最高精度，该值3000ms以上高精度定位才有效果
	}
	function getLocation(object: GetLocationObject): void;

	// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
	interface AuthorizeObject extends WXCallObject<{}> {
		scope: string;	//	需要获取权限的 scope，详见 scope 列表
	}
	function authorize(object: AuthorizeObject): void;	// {errMsg: "authorize:ok"} / {errMsg: "authorize:fail"}

	// https://developers.weixin.qq.com/minigame/dev/api/device/clipboard/wx.setClipboardData.html
	interface SetClipboardDataObject extends WXCallObject<{}> {
		data: string;	//	剪贴板的内容
	}
	function setClipboardData(object: SetClipboardDataObject): void;
	function getClipboardData(object: WXCallObject<{data: string}>): void;

	// https://developers.weixin.qq.com/minigame/dev/api/network/upload/UploadTask.html
	interface UploadTask {
		abort(): void;	// 中断上传任务
		onProgressUpdate(callback: (res: {progress: number, totalBytesSent: number, totalBytesExpectedToSend: number}) => void): void;	// 监听上传进度变化事件
		offProgressUpdate(callback: () => void): void;	// 取消监听上传进度变化事件
		onHeadersReceived(callback: (res: {header: Object}) => void): void;	// 监听 HTTP Response Header 事件。会比请求完成事件更早
		offHeadersReceived(callback: () => void): void;	// 取消监听 HTTP Response Header 事件
	}
	interface UploadFileObject extends WXCallObject<{data: string, statusCode: number}> {
		url: string;	// 开发者服务器地址
		filePath: string;	// 要上传文件资源的路径 (本地路径)
		name: string;	// 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
		header?: Object;	// HTTP 请求 Header，Header 中不能设置 Referer
		formData?: Object;	// HTTP 请求中其他额外的 form data
		timeout?: number;	// 超时时间，单位为毫秒	2.10.0
	}
	// https://developers.weixin.qq.com/minigame/dev/api/network/upload/wx.uploadFile.html
	function uploadFile(object: UploadFileObject): UploadTask;

	interface SaveImageToPhotosAlbumObject extends WXCallObject<{}> {
		filePath: string;	// 图片文件路径，可以是临时文件路径或永久文件路径 (本地路径) ，不支持网络路径
	}
	// https://developers.weixin.qq.com/minigame/dev/api/media/image/wx.saveImageToPhotosAlbum.html
	function saveImageToPhotosAlbum(object: SaveImageToPhotosAlbumObject): void;

	interface PreviewImageObject extends WXCallObject<{}> {
		urls: string[];	// 需要预览的图片链接列表。2.2.3 起支持云文件ID。
		showmenu?: boolean;	// true 是否显示长按菜单
		current?: string;	// urls的第一张 当前显示图片的链接
	}
	// https://developers.weixin.qq.com/minigame/dev/api/media/image/wx.previewImage.html
	function previewImage(object: PreviewImageObject): void;

	// https://developers.weixin.qq.com/minigame/dev/api/game-server-manager/wx.getGameServerManager.html
	function getGameServerManager(): GameServerManager;
	// https://developers.weixin.qq.com/minigame/dev/api/game-server-manager/GameServerManager.html
	interface GameServerManager {
		// https://developers.weixin.qq.com/minigame/dev/api/game-server-manager/GameServerManager.setState.html
		// userState 该玩家的自定义状态信息，长度限制为 256 个字符
		setState(object: {userState: string} & WXCallObject<{}>): Promise<void>;
	}
}

declare const __wxConfig: wx.WXConfig;