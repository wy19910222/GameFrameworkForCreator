declare interface Math {
	/**
	 * Returns a pseudorandom integer between min and max.
	 * @param min include.
	 * @param max exclude.
	 */
	randomRangeInt(min: number, max:number): number;
	/**
	 * Returns a pseudorandom number between min and max.
	 * @param min include.
	 * @param max exclude.
	 */
	randomRangeFloat(min: number, max: number): number;
	/**
	 * Clamps a number between a minimum float and maximum float value.
	 * @param num expect number.
	 * @param min include.
	 * @param max include.
	 */
	clamp(num: number, min: number, max: number): number;
	/**
	 * Calculate average of nums.
	 * @param nums the nums want to calculate.
	 */
	average(...nums: number[]): number;
	/**
	 * Calculate variance of nums.
	 * @param nums the nums want to calculate.
	 */
	variance(...nums: number[]): number;
	/**
	 * Convert radians to degrees.
	 * @param rad radians
	 */
	rad2deg(rad: number): number;
	/**
	 * Convert degrees to radians.
	 * @param deg degrees.
	 */
	deg2rad(deg: number): number;
}