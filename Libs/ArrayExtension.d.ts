interface Array<T> {
	/**
	 * Removes the last element from an array and returns it.
	 */
	peek(): T | undefined;

	/**
	 * Determines whether an array includes a certain element, returning true or false as appropriate.
	 * @param searchElement The element to search for.
	 * @param fromIndex The position in this array at which to begin searching for searchElement.
	 */
	includes(searchElement: T, fromIndex?: number): boolean;

	/**
	 * Returns the index of the first element in the array where predicate is true, and -1
	 * otherwise.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found,
	 * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	findIndex(predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg?: any): number;
	/**
	 * Returns the value of the first element in the array where predicate is true, and undefined
	 * otherwise.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find
	 * immediately returns that element value. Otherwise, find returns undefined.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	find(predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg?: any): T | undefined;

	/**
	 * Returns the index of the last element in the array where predicate is true, and -1
	 * otherwise.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found,
	 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	findLastIndex(predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg?: any): number;
	/**
	 * Returns the value of the first element in the array where predicate is true, and undefined
	 * otherwise.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find
	 * immediately returns that element value. Otherwise, find returns undefined.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	findLast(predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg?: any): T | undefined;

	/**
	 * Determines whether an array includes a certain element, returning true or false as appropriate.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find
	 * immediately returns that element value. Otherwise, find returns undefined.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	contains(predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg?: any): boolean;
}

interface ArrayConstructor {
	/**
	 * Determines whether an array includes a certain element, returning true or false as appropriate.
	 * @param arrayLike An array-like object to convert to an array.
	 * @param searchElement The element to search for.
	 * @param fromIndex The position in this array at which to begin searching for searchElement.
	 */
	includes<T>(arrayLike: ArrayLike<T>, searchElement: T, fromIndex?: number): boolean;

	/**
	 * Returns the index of the first occurrence of a value in an array.
	 * @param arrayLike An array-like object to convert to an array.
	 * @param searchElement The value to locate in the array.
	 * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
	 */
	indexOf<T>(arrayLike: ArrayLike<T>, searchElement: T, fromIndex?: number): number;

	/**
	 * Returns the index of the last occurrence of a specified value in an array.
	 * @param arrayLike An array-like object to convert to an array.
	 * @param searchElement The value to locate in the array.
	 * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
	 */
	lastIndexOf<T>(arrayLike: ArrayLike<T>, searchElement: T, fromIndex?: number): number;

	/**
	 * Returns the index of the first element in the array where predicate is true, and -1
	 * otherwise.
	 * @param arrayLike An array-like object to convert to an array.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found,
	 * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	findIndex<T>(arrayLike: ArrayLike<T>, predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg?: any): number;
	/**
	 * Returns the value of the first element in the array where predicate is true, and undefined
	 * otherwise.
	 * @param arrayLike An array-like object to convert to an array.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find
	 * immediately returns that element value. Otherwise, find returns undefined.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	find<T>(arrayLike: ArrayLike<T>, predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg?: any): T | undefined;

	/**
	 * Returns the index of the last element in the array where predicate is true, and -1
	 * otherwise.
	 * @param arrayLike An array-like object to convert to an array.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found,
	 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	findLastIndex<T>(arrayLike: ArrayLike<T>, predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg?: any): number;
	/**
	 * Returns the value of the first element in the array where predicate is true, and undefined
	 * otherwise.
	 * @param arrayLike An array-like object to convert to an array.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find
	 * immediately returns that element value. Otherwise, find returns undefined.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	findLast<T>(arrayLike: ArrayLike<T>, predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg?: any): T | undefined;

	/**
	 * Determines whether an array includes a certain element, returning true or false as appropriate.
	 * @param arrayLike An array-like object to convert to an array.
	 * @param predicate find calls predicate once for each element of the array, in ascending
	 * order, until it finds one where predicate returns true. If such an element is found, find
	 * immediately returns that element value. Otherwise, find returns undefined.
	 * @param thisArg If provided, it will be used as the this value for each invocation of
	 * predicate. If it is not provided, undefined is used instead.
	 */
	contains<T>(arrayLike: ArrayLike<T>, predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg?: any): boolean;
}