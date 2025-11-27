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

	// I wanted to name this inValidRange, but I realised that, unless you verify its behaviour by looking at the camel case,
	// it can look like it's called 'invalidRange', as in the opposite of what it's actually accomplishing 😭😭
	public contains(num: number):boolean {
		return (num>=this._min && num<=this._max);
	}
}
