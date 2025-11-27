import { ColourField } from "~/utils/colour-picker/colour-field";

export class RgbColourModel {
	private _red: ColourField;
	private _green: ColourField;
	private _blue: ColourField;

	constructor(red: number, green: number, blue: number) {
		this._red = new ColourField("Red", red, 0, 255, 0);
		this._green = new ColourField("Green", green, 0, 255, 0);
		this._blue = new ColourField("Blue", blue, 0, 255, 0);
	}

	public getRed(): ColourField { return this._red.clone(); }
	public setRed(value: number) { this._red.value = value; }

	public getGreen(): ColourField { return this._green.clone(); }
	public setGreen(value: number) { this._green.value = value; }

	public getBlue(): ColourField { return this._blue.clone(); }
	public setBlue(value: number) { this._blue.value = value; }

	public clone(): RgbColourModel {
		return new RgbColourModel(this._red.value, this._green.value, this._blue.value);
	}
}
