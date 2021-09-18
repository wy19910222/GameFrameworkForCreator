declare function require(request: string): any;

declare namespace cc {
	export let profiler: {
		hideStats: () => void,
		showStats: () => void,
		isShowingStats: () => boolean,
	};
}