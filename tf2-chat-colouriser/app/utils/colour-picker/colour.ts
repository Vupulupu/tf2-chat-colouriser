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

	public static createFromRGB(red: number, green: number, blue: number): Colour {
		//TODO: compute all member vars from given rgb values and construct a Colour obj
		return new Colour({"hue": 0, "saturation": 0, "value": 0},
		                  {"red": 0, "green": 0, "blue": 0},
		                  "");
	}

	public static createFromHSV(hue: number, saturation: number, value: number): Colour {
		let hsv: {"hue": number, "saturation": number, "value": number} = {"hue": hue, "saturation": saturation, "value": value};
		let rgb: {"red": number, "green": number, "blue": number} = Colour.hsvToRGB(hsv);
		let hex: string = Colour.rgbToHex(rgb);

		return new Colour(hsv, rgb, hex);
	}

	public static createFromHex(hex: string): Colour {
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
	public get hsv(): {"hue": number, "saturation": number, "value": number} {
		return { "hue": this._hsv.hue, "saturation": this._hsv.saturation, "value": this._hsv.value };
	}
	private set hsv(hsv: {"hue": number, "saturation": number, "value": number}) {
		this._hsv.hue = hsv.hue;
		this._hsv.saturation = hsv.saturation;
		this._hsv.value = hsv.value;
	}

	public set hsvHue(hue: number) {
		if (Colour.rangeIsValid(hue, Colour._valueRanges.hue.min, Colour._valueRanges.hue.max)) {
			this._hsv.hue = hue;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.hue;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("HSV 'hue'", valueRange.min, valueRange.max, hue));
		}
	}

	public set hsvSaturation(saturation: number) {
		if (Colour.rangeIsValid(saturation, Colour._valueRanges.saturation.min, Colour._valueRanges.saturation.max)) {
			this._hsv.saturation = saturation;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.saturation;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("HSV 'saturation'", valueRange.min, valueRange.max, saturation));
		}
	}

	public set hsvValue(value: number) {
		if (Colour.rangeIsValid(value, Colour._valueRanges.value.min, Colour._valueRanges.value.max)) {
			this._hsv.value = value;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.value;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("HSV 'value'", valueRange.min, valueRange.max, value));
		}
	}

	// RGB
	public get rgb(): {"red": number, "green": number, "blue": number} {
		return { "red": this._rgb.red, "green": this._rgb.green, "blue": this._rgb.blue };
	}
	private set rgb(rgb: {"red": number, "green": number, "blue": number}) {
		this._rgb.red = rgb.red;
		this._rgb.green = rgb.green;
		this._rgb.blue = rgb.blue;
	}

	public set rgbRed(red: number) {
		if (Colour.rangeIsValid(red, Colour._valueRanges.red.min, Colour._valueRanges.red.max)) {
			this._rgb.red = red;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.red;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("RGB 'red'", valueRange.min, valueRange.max, red));
		}
	}

	public set rgbGreen(green: number) {
		if (Colour.rangeIsValid(green, Colour._valueRanges.green.min, Colour._valueRanges.green.max)) {
			this._rgb.green = green;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.green;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("RGB 'green'", valueRange.min, valueRange.max, green));
		}
	}

	public set rgbBlue(blue: number) {
		if (Colour.rangeIsValid(blue, Colour._valueRanges.blue.min, Colour._valueRanges.blue.max)) {
			this._rgb.blue = blue;
		} else {
			const valueRange: ValueRange = Colour._valueRanges.blue;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("RGB 'blue'", valueRange.min, valueRange.max, blue));
		}
	}

	public get hex(): string {
		return this._hex;
	}
	public set hex(hex: string) {
		let formattedHex = hex;
		if (hex.charAt(0) === '#') {
			formattedHex = '#' + hex;
		}

		if (formattedHex.match(/^#[A-Fa-f\d]{6}$/)) {
			this._hex = formattedHex.toUpperCase();
		} else {
			throw new ColourError(Colour.buildMismatchedArgErrorMessage("HEX code", "digits and letters A-F", hex));
		}
	}

	public toString(): string {
		return `Colour:\n` +
		       `\thsv(${this._hsv.hue} ${this._hsv.saturation.toPrecision(4)}% ${this._hsv.value.toPrecision(4)}%)\n` +
		       `\trgb(${this._rgb.red} ${this._rgb.green} ${this._rgb.blue})\n` +
		       `\thex: ${this._hex}`;
	}

	//https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
	private static hsvToRGB(hsv: {"hue": number, "saturation": number, "value": number}): {"red": number, "green": number, "blue": number} {
		const hueNormalised: number = hsv.hue / 60;
		const chromaNormalised: number = (hsv.saturation * hsv.value) / (100**2);
		const hueAdjustment: number = (1 - Math.abs((hueNormalised % 2) - 1)) * chromaNormalised;
		let rgb: {"red": number, "green": number, "blue": number} = {"red": 0, "green": 0, "blue": 0};

		if (0<=hueNormalised && hueNormalised<1) {          // #HiLo00
			rgb.red = chromaNormalised;
			rgb.green = hueAdjustment;
		} else if (1<=hueNormalised && hueNormalised<2) {   // #LoHi00
			rgb.green = chromaNormalised;
			rgb.red = hueAdjustment;
		} else if (2<=hueNormalised && hueNormalised<3) {   // #00HiLo
			rgb.green = chromaNormalised;
			rgb.blue = hueAdjustment;
		} else if (3<=hueNormalised && hueNormalised<4) {   // #00LoHi
			rgb.blue = chromaNormalised;
			rgb.green = hueAdjustment;
		} else if (4<=hueNormalised && hueNormalised<5) {   // #Lo00Hi
			rgb.blue = chromaNormalised;
			rgb.red = hueAdjustment;
		} else if (5<=hueNormalised && hueNormalised<6) {   // #Hi00Lo
			rgb.red = chromaNormalised;
			rgb.blue = hueAdjustment;
		} else {
			throw new ColourError(`Attempted to normalise HSV 'hue' value when converting HSV model to RGB, but value is out of the range 0-6: ${hueNormalised}`);
		}

		const valueAdjustment: number = (hsv.value / 100) - chromaNormalised;
		rgb.red = Math.round((rgb.red + valueAdjustment) * 255);
		rgb.green = Math.round((rgb.green + valueAdjustment) * 255);
		rgb.blue = Math.round((rgb.blue + valueAdjustment) * 255);

		let outOfRangeVals: string[] = [];
		if (Colour.rangeIsValid(rgb.red, 0, 255)) {
			outOfRangeVals.push("red");
		}
		if (Colour.rangeIsValid(rgb.green, 0, 255)) {
			outOfRangeVals.push("green");
		}
		if (Colour.rangeIsValid(rgb.blue, 0, 255)) {
			outOfRangeVals.push("blue");
		}

		if (outOfRangeVals.length > 0) {
			let errorMessage: string = `Attempted to convert HSV model to RGB, but ` +
			                           `${outOfRangeVals.length} computed RGB value${outOfRangeVals.length>1?"s are":" is "}` +
			                           `out of the range 0-255: {r: ${rgb.red}, g: ${rgb.green}, b: ${rgb.blue}}`;
			throw new ColourError(errorMessage);
		}

		return rgb;
	}

	//https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
	private static rgbToHSV(): {"hue": number, "saturation": number, "value": number} {

		return {"hue": 0, "saturation": 0,"value": 0};
	}

	private static rgbToHex(rgb: {"red": number, "green": number, "blue": number}): string {
		let hex: string = "#", redHex: string, greenHex: string, blueHex: string;
		redHex = rgb.red.toString(16).padStart(2, '0');
		greenHex = rgb.green.toString(16).padStart(2, '0');
		blueHex = rgb.blue.toString(16).padStart(2, '0');
		hex += redHex + greenHex + blueHex;
		return hex.toUpperCase();
	}

	private static hexToRGB(hex: string): {"red": number, "green": number, "blue": number} {
		let red: number, green: number, blue: number;
		let rawHex: string = hex.slice(1);
		red = parseInt(rawHex.slice(0, 2), 16);
		green = parseInt(rawHex.slice(2, 4), 16);
		blue = parseInt(rawHex.slice(4), 16);
		return {"red": red, "green": green, "blue": blue}
	}

	// I wanted to name this inValidRange, but I realised that, unless you verify with the camel case,
	// it looks like it's called 'invalidRange' as in the opposite of what it's actually accomplishing 😭😭
	private static rangeIsValid(num: number, min: number, max: number) {
		return (num<min || num>max);
	}

	private static buildOutOfRangeArgMessage(targetName: string, input: number, min: number, max: number): string {
		return `Colour's ${targetName} value must be between` +
		       `${min} and ${max},` +
		       `but the argument provided was ${input}`;
	}

	private static buildMismatchedArgErrorMessage(target: string, input: string, validChars: string): string {
		return `Colour's ${target} must be only contain ${validChars},` +
		       `but the argument provided was ${input}`;
	}
}
