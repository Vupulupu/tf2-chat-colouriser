export class ValueRange {
	private readonly _min: number;
	private readonly _max: number;

	constructor(min: number, max: number) {
		this._min = min;
		this._max = max;
	}

	get min() {
		return this._min;
	}
	get max() {
		return this._max;
	}
}
