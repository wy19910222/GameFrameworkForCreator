interface Number {
	/**
	 * Returns a string representing a number in floated-point notation.
	 * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
	 */
	toFloated(fractionDigits?: number): string;
}