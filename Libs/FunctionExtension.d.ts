declare interface Function {
	/**
	  * For a given function, creates a bound function that has the same body as the original function.
	  * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
	  * @param thisArg An object to which the this keyword can refer inside the new function.
	  * @param argArray A list of arguments to be passed to the new function.
	  */
	tailBind(this: Function, thisArg: any, ...argArray: any[]): Function;
	/**
	  * For two given function, creates a bound function that call both, and return result of original function.
	  * @param thisArg An object to which the this keyword can refer inside the new function. function can bind again if it is null.
	  * @param after A function which will be called after original function.
	  */
	combineAfter<T extends Function>(this: Function, thisArg: any, after: T): this & T;
	/**
	  * For two given function, creates a bound function that call both, and return result of original function.
	  * @param thisArg An object to which the this keyword can refer inside the new function. function can bind again if it is null.
	  * @param before A function which will be called before original function.
	  */
	combineBefore<T extends Function>(this: Function, thisArg: any, before: T): this & T;
}