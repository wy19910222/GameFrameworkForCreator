// let timeoutIdMap = {};
// let setTimeoutFunc = window.setTimeout;
// window.setTimeout = function (callback, delay) {
//     if (!delay) {
//         let timeoutId = setTimeoutFunc(function () {
//             clearTimeout(timeoutId);
//             callback && callback();
//         }, delay);
//         timeoutIdMap[timeoutId] = requestAnimationFrame(function () {
//             clearTimeout(timeoutId);
//             callback && callback();
//         });
//         return timeoutId;
//     } else {
//         return setTimeoutFunc(callback, delay);
//     }
// };
// let clearTimeoutFunc = window.clearTimeout;
// window.clearTimeout = function (id) {
//     if (timeoutIdMap[id]) {
//         cancelAnimationFrame(timeoutIdMap[id]);
//         delete timeoutIdMap[id];
//     }
//     clearTimeoutFunc(id);
// };