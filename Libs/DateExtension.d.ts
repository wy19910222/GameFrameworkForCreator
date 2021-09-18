interface Date {
	/**
	 * Pattern: y-year, M-month, d-date, H-hours24, h-hours12, m-minutes, s-seconds，f-milliSeconds
	 */
	toCustomString(this: Date, formatStr: string): string;
}