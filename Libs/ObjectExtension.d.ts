interface Diff {
	[key: string]: number | Diff;
}

interface ObjectConstructor {
	/**
	 * Copy object values, support loop reference.
	 * target object. Returns the target object.
	 * @param {Object} obj The target object.
	 * @return {Object} The object's clone.
	 */
	deepCopy<T extends Object>(obj: T): T;

	/**
	 * Differ obj1 and obj2, and return difference.
	 * 1:	obj2 has key and obj1 not have.
	 * -1:	obj1 has key and obj2 not have.
	 * 0:	both obj1 and obj2 has key but has not same value.
	 * @param {Object} obj1 The first object.
	 * @param {Object} obj2 The second object.
	 * @return {Diff} The difference between a and b.
	 */
	diff(obj1: Object, obj2: Object): Diff;

	/**
	  * Copy the values of all of the enumerable own properties from one or
	  * more source objects to a target object. Returns the target object.
	  * @param target The target object to copy to.
	  * @param source The source object from which to copy properties.
	  */
	merge<T, U>(target: T, source: U): T & U;

	/**
	 * Find value by path like "key1.3.key2" from object.
	 * @param {Object} obj The target object.
	 * @param {string} path Path of value.
	 * @return {Object} Value in object.
	 */
	findByPath(obj: Object, path: string): any;

	/**
	 * Delete keys which has undefined value in target object.
	 * @param {Object} obj The target object to delete key.
	 * @param {string[]} deletedKeys Deleted key array.
	 * @return {Object} The expected object.
	 */
	trim<T extends Object>(obj: T, deletedKeys?: string[]): T;

	/**
	 * Pick object values to new object by keys, weed out other keys.
	 * @param {Object} obj The target object to pick.
	 * @param {string[]} keys Picked keys.
	 * @return {Object} The new object.
	 */
	pick<T extends Object, K extends keyof T>(obj: T, keys: K[] | null): Pick<T, K>;

	/**
	 * Pluck values by keys in object.
	 * @param {Object} obj The target object to pluck.
	 * @param {string[]} keys Plucked keys array.
	 * @return {Object} plucked values array.
	 */
	pluck<T extends Object, K extends keyof T>(obj: T, keys: K[] | null): T[K][];

	/**
	 * Create object by array.
	 * @param {ReadonlyArray<readonly [K, T[K]]> | null} iterable.
	 * @return {T} The expected object.
	 */
	fromEntries<T extends Object, K extends keyof T>(iterable?: Iterable<[K, T[K]]> | null): T;
}