const indexOf = function (arrayLike, searchElement, fromIndex) {
	if (arrayLike) {
		const length = arrayLike.length;
		if (fromIndex == null || fromIndex <= -length) {
			fromIndex = 0;
		} else if (fromIndex < 0) {
			fromIndex += length;
		}
		for (let index = fromIndex || 0, length = arrayLike.length; index < length; ++index) {
			if (arrayLike[index] === searchElement) {
				return index;
			}
		}
	}
	return -1;
};
const lastIndexOf = function (arrayLike, searchElement, fromIndex) {
	if (arrayLike) {
		const length = arrayLike.length;
		if (fromIndex == null || fromIndex >= length) {
			fromIndex = length - 1;
		} else if (fromIndex < 0) {
			fromIndex += length
		}
		for (let index = fromIndex; index >= 0; --index) {
			if (arrayLike[index] === searchElement) {
				return index;
			}
		}
	}
	return -1;
};
const findIndex = function (arrayLike, predicate, thisArg) {
	if (arrayLike && predicate) {
		for (let index = 0, length = arrayLike.length; index < length; ++index) {
			if (predicate.call(thisArg, arrayLike[index], index, arrayLike)) {
				return index;
			}
		}
	}
	return -1;
};
const findLastIndex = function (arrayLike, predicate, thisArg) {
	if (arrayLike && predicate) {
		for (let index = arrayLike.length - 1; index >= 0; --index) {
			if (predicate.call(thisArg, arrayLike[index], index, arrayLike)) {
				return index;
			}
		}
	}
	return -1;
};

Array.prototype.peek || Object.defineProperty(Array.prototype, "peek", {
	value: function () {
		return this[this.length - 1];
	}
});
Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
	value: function (searchElement, fromIndex) {
		return this.indexOf(searchElement, fromIndex) !== -1;
	}
});
Array.prototype.findIndex || Object.defineProperty(Array.prototype, "findIndex", {
	value: function (predicate, thisArg) {
		return findIndex(this, predicate, thisArg);
	}
});
Array.prototype.find || Object.defineProperty(Array.prototype, "find", {
	value: function (predicate, thisArg) {
		const index = findIndex(this, predicate, thisArg);
		return index !== -1 ? this[index] : undefined;
	}
});
Array.prototype.findIndex || Object.defineProperty(Array.prototype, "findLastIndex", {
	value: function (predicate, thisArg) {
		return findLastIndex(this, predicate, thisArg);
	}
});
Array.prototype.find || Object.defineProperty(Array.prototype, "findLast", {
	value: function (predicate, thisArg) {
		const index = findLastIndex(this, predicate, thisArg);
		return index !== -1 ? this[index] : undefined;
	}
});
Array.prototype.contains || Object.defineProperty(Array.prototype, "contains", {
	value: function (predicate, thisArg) {
		return findIndex(this, predicate, thisArg) !== -1;
	}
});

Array.indexOf = function (arrayLike, searchElement, fromIndex) {
	if (arrayLike && arrayLike.indexOf) {
		return arrayLike.indexOf(searchElement, fromIndex);
	} else {
		return indexOf(arrayLike, searchElement, fromIndex);
	}
};
Array.lastIndexOf = function (arrayLike, searchElement, fromIndex) {
	if (arrayLike && arrayLike.lastIndexOf) {
		if (arguments.length < 3) {
			return arrayLike.lastIndexOf(searchElement);
		} else {
			return arrayLike.lastIndexOf(searchElement, fromIndex);
		}
	} else {
		if (arguments.length < 3) {
			return lastIndexOf(arrayLike, searchElement);
		} else {
			// 虽然不合理，但Array.prototype.lastIndexOf就是这样的
			return lastIndexOf(arrayLike, searchElement, fromIndex === undefined ? 0 : fromIndex);
		}
	}
};
Array.findIndex = function (arrayLike, predicate, thisArg) {
	if (arrayLike && arrayLike.findIndex) {
		return arrayLike.findIndex(predicate, thisArg);
	} else {
		return findIndex(arrayLike, predicate, thisArg);
	}
};
Array.includes = function (arrayLike, searchElement, fromIndex) {
	if (arrayLike) {
		if (arrayLike.includes) {
			return arrayLike.includes(searchElement, fromIndex);
		} else {
			return arrayLike.indexOf(searchElement, fromIndex) !== -1;
		}
	}
	return false;
};
Array.findIndex = function (arrayLike, predicate, thisArg) {
	if (arrayLike && arrayLike.findIndex) {
		return arrayLike.findIndex(predicate, thisArg);
	} else {
		return findIndex(arrayLike, predicate, thisArg);
	}
};
Array.find = function (arrayLike, predicate, thisArg) {
	if (arrayLike && arrayLike.find) {
		return arrayLike.find(predicate, thisArg);
	} else {
		const index = findIndex(arrayLike, predicate, thisArg);
		return index !== -1 ? arrayLike[index] : undefined;
	}
};
Array.findLastIndex = function (arrayLike, predicate, thisArg) {
	if (arrayLike && arrayLike.findLastIndex) {
		return arrayLike.findLastIndex(predicate, thisArg);
	} else {
		return findLastIndex(arrayLike, predicate, thisArg);
	}
};
Array.findLast = function (arrayLike, predicate, thisArg) {
	if (arrayLike && arrayLike.findLast) {
		return arrayLike.findLast(predicate, thisArg);
	} else {
		const index = findLastIndex(arrayLike, predicate, thisArg);
		return index !== -1 ? arrayLike[index] : undefined;
	}
};
Array.contains = function (arrayLike, predicate, thisArg) {
	if (arrayLike && arrayLike.contains) {
		return arrayLike.contains(predicate, thisArg);
	} else {
		return findIndex(arrayLike, predicate, thisArg) !== -1;
	}
};
