Object.deepCopy = function (obj) {
	let lookupDict = new Map();
	let copy = function (obj) {
		if (!(obj instanceof Object)) {
			return obj;
		} else if (lookupDict.has(obj)) {
			return lookupDict.get(obj);
		}
		let newObj;
		if (obj instanceof Array) {
			newObj = [];
			lookupDict.set(obj, newObj);
		} else if (obj instanceof Map) {
			newObj = new (obj.constructor)();
			lookupDict.set(obj, newObj);
			copyMap(obj, newObj);
		} else if (obj instanceof Set) {
			newObj = new (obj.constructor)();
			lookupDict.set(obj, newObj);
			copySet(obj, newObj);
		} else {
			newObj = {};
			lookupDict.set(obj, newObj);
		}
		copyObject(obj, newObj);
		return newObj;
	};
	let copyObject = function (from, to) {
		for (let index in from) {
			if (from.hasOwnProperty(index)) {
				to[index] = copy(from[index]);
			}
		}
	};
	let copyMap = function (from, to) {
		for (let [key, value] of from) {
			to.set(key, copy(value));
		}
	};
	let copySet = function (from, to) {
		for (let element of from) {
			to.add(copy(element));
		}
	};
	return copy(obj);
};

Object.diff = function (obj1, obj2) {
	let lookupMap = new Map();
	let diffFunc = function (obj1, obj2) {
		let map = lookupMap.get(obj1);
		if (!map) {
			map = new Map();
			lookupMap.set(obj1, map);
		}
		if (map.has(obj2)) {
			return map.get(obj2);
		}
		let diff = {};
		map.set(obj2, diff);
		for (const key in obj1) {
			if (obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
				diff[key] = -1;
			}
		}
		for (const key in obj2) {
			if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
				diff[key] = 1;
			}
		}
		for (const key in obj1) {
			if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
				const element1 = obj1[key];
				const element2 = obj2[key];
				if (element1 !== element2) {
					if (element1 instanceof Object && element2 instanceof Object) {
						diff[key] = diffFunc(element1, element2);
					} else {
						diff[key] = 0;
					}
				}
			}
		}
		return diff;
	};
	return diffFunc(obj1, obj2);
};

Object.merge = function (target, source) {
	return target ? source ? Object.assign(target, source) : target : source;
};

Object.findByPath = function (obj, path) {
	let keys = path.split(".");
	let child = obj;
	for (let name of keys) {
		child = child[name];
		if (!child) {
			return null;
		}
	}
	return child;
};

Object.trim = function (obj, deletedKeys) {
	if (obj) {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				let valueElement = obj[key];
				if (valueElement === undefined) {
					delete obj[key];
					deletedKeys && deletedKeys.push(key);
				}
			}
		}
	}
	return obj;
};

Object.pick = function (obj, keys) {
	let newObj = {};
	keys && keys.forEach(key => newObj[key] = obj[key]);
	return newObj;
};

Object.pluck = function (obj, keys) {
	return keys ? keys.map(key => obj[key]) : [];
};

Object.fromEntries = Object.fromEntries || function (entries) {
	let newObj = {};
	if (entries) {
		for (let element of entries) {
			newObj[element[0]] = element[1];
		}
	}
	return newObj;
};