import { ValueRange } from "~/utils/value-range";
import { ColourError } from "~/utils/colour-picker/colour-error";

export class ColourField {
	public readonly name: string;
	protected _value: number;
	protected readonly _valueRange: ValueRange;
	public readonly fractionalPrecision: number
	public readonly formatter: (_: number)=>number;

	constructor(name: string, value: number,
	            min: number, max: number, fractionalPrecision: number,
	            formatter: (_: number)=>number = (_: number)=>_) {
		this.name = name;
		this.formatter = formatter;
		this._valueRange = new ValueRange(min, max);
		this.fractionalPrecision = fractionalPrecision;
		this.formatter = formatter;

		this._value = this._validateValue(value);
	}

	public get value() { return this._value }
	public set value(value: number) {
		this._value = this._validateValue(value);
	}

	private _validateValue(value: number, range: ValueRange = this._valueRange): number {
		if (range.contains(value)) {
			return value;
		} else {
			throw new ColourError(`Attempted to set colour field ${this.name.toLowerCase()}'s value, but the value was out of range ` +
				`(Value must be between ${this.min} and ${this.max}, but argument was ${value}).`);
		}
	}

	public get min() { return this._valueRange.min; }
	public get max() { return this._valueRange.max; }

	public clone(): ColourField {
		return new ColourField(this.name, this.value, this.min, this.max, this.fractionalPrecision, this.formatter);
	}
}
