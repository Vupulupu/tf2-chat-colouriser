import { ColourField } from "~/utils/colour-picker/colour-field";

export class HsvColourModel {
	private _hue: ColourField;
	private _saturation: ColourField;
	private _value: ColourField;

	constructor(hue: number, saturation: number, value: number) {
		this._hue = new ColourField("Hue", hue, 0, 360, 0,(_: number)=>Math.round(_));
		this._saturation = new ColourField("Saturation", saturation, 0, 100, 1, (_: number)=>parseFloat(_.toFixed(1)));
		this._value = new ColourField("Value", value, 0, 100, 1, (_: number)=>parseFloat(_.toFixed(1)));
	}

	public getHue(): ColourField { return this._hue.clone(); }
	public setHue(value: number): void { this._hue.value = value; }

	public getSaturation(): ColourField { return this._saturation.clone(); }
	public setSaturation(value: number): void { this._saturation.value = value; }

	public getValue(): ColourField { return this._value.clone(); }
	public setValue(value: number): void { this._value.value = value; }

	public clone(): HsvColourModel {
		return new HsvColourModel(this._hue.value, this._saturation.value, this._value.value);
	}
}
