import { ColourError } from "~/utils/colour-picker/colour-error";

export class ColourCode {
	public readonly name: string;
	protected _value: string;
	private readonly pattern: RegExp;

	constructor(name: string, value: string, pattern: RegExp) {
		this.name = name;
		this.pattern = new RegExp(pattern.source);

		this._value = this._validateValue(value);
	}

	public get value() { return this._value; }
	public set value(value: string) {
		this._value = this._validateValue(value);
	}

	private _validateValue(value: string, pattern: RegExp = this.pattern): string {
		if (value.match(pattern)) {
			return value;
		} else {
			throw new ColourError(`Attempted to set the colour ${this.name.toLowerCase()} code's value, `+
				`but did not match the expected format (Code must match ` +
				`the regular expression ${pattern.source}, but argument was ${value}).`);
		}
	}

	public clone(): ColourCode {
		return new ColourCode(this.name, this.value, this.pattern);
	}
}
