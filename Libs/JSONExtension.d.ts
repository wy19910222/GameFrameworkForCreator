interface JSON {
	/**
	 * Converts a JavaScript Object Notation (JSON) string into an object.
	 * @param text A valid JSON string.
	 * @param proto The value of the new prototype or null.
	 * @param reviver A function that transforms the results. This function is called for each member of the object.
	 * If a member contains nested objects, the nested objects are transformed before the parent object is.
	 */
	parseBy<T>(text: string, proto: T, reviver?: (key: any, value: any) => any): T;
}