import { ColourError } from "~/utils/colour-picker/colour-error";
import { ValueRange } from "~/utils/value-range";

export class Colour {
	private _hsv: {"hue": number, "saturation": number,"value": number};
	private _rgb: {"red": number, "green": number, "blue": number};
	private _hex: string;
	private static _valueRanges: {"hue":ValueRange, "saturation":ValueRange, "value":ValueRange,
		                          "red":ValueRange, "green":ValueRange, "blue":ValueRange
	} = {
		"hue": new ValueRange(0, 360),
		"saturation": new ValueRange(0, 100),
		"value": new ValueRange(0, 100),
		"red": new ValueRange(0, 255),
		"green": new ValueRange(0, 255),
		"blue": new ValueRange(0, 255),
	};

	static createFromRGB(red: number, green: number, blue: number): Colour {
		//TODO: compute all member vars from given rgb values and construct a Colour obj
		return new Colour({"hue": 0, "saturation": 0, "value": 0},
		                  {"red": 0, "green": 0, "blue": 0},
		                  "");
	}

	static createFromHSV(hue: number, saturation: number, blue: number): Colour {
		//TODO: compute all member vars from given hsv values and construct a Colour obj
		return new Colour({"hue": 0, "saturation": 0, "value": 0},
		                  {"red": 0, "green": 0, "blue": 0},
		                  "");
	}

	static createFromHex(hex: string): Colour {
		//TODO: compute all member vars from a given hex code and construct a Colour obj
		return new Colour({"hue": 0, "saturation": 0, "value": 0},
		                  {"red": 0, "green": 0, "blue": 0},
		                  "");
	}

	private constructor(hsv: {"hue": number, "saturation": number,"value": number},
	                    rgb: {"red": number, "green": number, "blue": number},
	                    hex: string) {
		this._hsv = {"hue": hsv.hue, "saturation": hsv.saturation, "value": hsv.value}
		this._rgb = {"red": rgb.red, "green": rgb.green, "blue": rgb.blue};
		this._hex = hex;
	}

	// HSV
	get hsv(): {"hue": number, "saturation": number, "value": number} {
		return { "hue": this._hsv.hue, "saturation": this._hsv.saturation, "value": this._hsv.value };
	}
	private set hsv(hsv: {"hue": number, "saturation": number, "value": number}) {
		this._hsv.hue = hsv.hue;
		this._hsv.saturation = hsv.saturation;
		this._hsv.value = hsv.value;
	}

	set hsvHue(hue: number) {
		if (this.rangeIsValid(hue, Colour._valueRanges.hue.min, Colour._valueRanges.hue.max)) {
			this._hsv.hue = hue;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.hue;
			throw new ColourError(this.buildOutOfRangeErrorMessage("HSV 'hue'", valueRange.min, valueRange.max, hue));
		}
	}

	set hsvSaturation(saturation: number) {
		if (this.rangeIsValid(saturation, Colour._valueRanges.saturation.min, Colour._valueRanges.saturation.max)) {
			this._hsv.saturation = saturation;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.saturation;
			throw new ColourError(this.buildOutOfRangeErrorMessage("HSV 'saturation'", valueRange.min, valueRange.max, saturation));
		}
	}

	set hsvValue(value: number) {
		if (this.rangeIsValid(value, Colour._valueRanges.value.min, Colour._valueRanges.value.max)) {
			this._hsv.value = value;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.value;
			throw new ColourError(this.buildOutOfRangeErrorMessage("HSV 'value'", valueRange.min, valueRange.max, value));
		}
	}

	// RGB
	get rgb(): {"red": number, "green": number, "blue": number} {
		return { "red": this._rgb.red, "green": this._rgb.green, "blue": this._rgb.blue };
	}
	private set rgb(rgb: {"red": number, "green": number, "blue": number}) {
		this._rgb.red = rgb.red;
		this._rgb.green = rgb.green;
		this._rgb.blue = rgb.blue;
	}

	set rgbRed(red: number) {
		if (this.rangeIsValid(red, Colour._valueRanges.red.min, Colour._valueRanges.red.max)) {
			this._rgb.red = red;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.red;
			throw new ColourError(this.buildOutOfRangeErrorMessage("RGB 'red'", valueRange.min, valueRange.max, red));
		}
	}

	set rgbGreen(green: number) {
		if (this.rangeIsValid(green, Colour._valueRanges.green.min, Colour._valueRanges.green.max)) {
			this._rgb.green = green;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.green;
			throw new ColourError(this.buildOutOfRangeErrorMessage("RGB 'green'", valueRange.min, valueRange.max, green));
		}
	}

	set rgbBlue(blue: number) {
		if (this.rangeIsValid(blue, Colour._valueRanges.blue.min, Colour._valueRanges.blue.max)) {
			this._rgb.blue = blue;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.blue;
			throw new ColourError(this.buildOutOfRangeErrorMessage("RGB 'blue'", valueRange.min, valueRange.max, blue));
		}
	}

	get hex(): string {
		return this._hex;
	}
	set hex(hex: string) {
		let formattedHex = hex;
		if (hex.charAt(0) === '#') {
			formattedHex = '#'.concat(hex);
		}

		if (formattedHex.match(/^#[A-Fa-f\d]{6}$/)) {
			this._hex = formattedHex;
		} else {
			throw new ColourError(this.buildInvalidCodeErrorMessage("HEX code", "digits and letters A-F", hex));
		}
	}

	private hsvToRGB(): {"red": number, "green": number, "blue": number} {
		//TODO: convert hsv values to rgb values (https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV)
		return {"red": 0, "green": 0, "blue": 0}
	}

	private rgbToHex(): string {
		//TODO: convert rgb values to hex code
		return "";
	}

	private hexToRGB(): {"red": number, "green": number, "blue": number} {
		//TODO: convert rgb values to hex code
		return {"red": 0, "green": 0, "blue": 0}
	}

	private rgbToHSV(): {"hue": number, "saturation": number, "value": number} {
		//TODO: convert rgb values to hsv values (https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB)
		return {"hue": 0, "saturation": 0,"value": 0};
	}
	private buildOutOfRangeErrorMessage(targetName: string, input: number, min: number, max: number): string {
		return `Colour's ${targetName} value must be between` +
		       `${min} and ${max},` +
		       `but the argument provided was ${input}`;
	}

	private buildInvalidCodeErrorMessage(target: string, input: string, validChars: string): string {
		return `Colour's ${target} must be only contain ${validChars},` +
		       `but the argument provided was ${input}`;
	}
}
