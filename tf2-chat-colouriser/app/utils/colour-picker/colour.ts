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
		let rgb: {"red": number, "green": number, "blue": number} = {"red": red, "green": green, "blue": blue};
		let hsv: {"hue": number, "saturation": number, "value": number} = Colour.rgbToHSV(rgb);
		let hex: string = Colour.rgbToHex(rgb);

		return new Colour(hsv, rgb, hex);
	}

	public static createFromHSV(hue: number, saturation: number, value: number): Colour {
		let hsv: {"hue": number, "saturation": number, "value": number} = {"hue": hue, "saturation": saturation, "value": value};
		let rgb: {"red": number, "green": number, "blue": number} = Colour.hsvToRGB(hsv);
		let hex: string = Colour.rgbToHex(rgb);

		return new Colour(hsv, rgb, hex);
	}

	public static createFromHex(hex: string): Colour {
		hex = hex.toUpperCase();
		let rgb: {"red": number, "green": number, "blue": number} = Colour.hexToRGB(hex);
		let hsv: {"hue": number, "saturation": number, "value": number} = Colour.rgbToHSV(rgb);

		return new Colour(hsv, rgb, hex);
	}

	private constructor(hsv: {"hue": number, "saturation": number,"value": number},
	                    rgb: {"red": number, "green": number, "blue": number},
	                    hex: string) {
		this._hsv = {"hue": hsv.hue, "saturation": hsv.saturation, "value": hsv.value}
		this._rgb = {"red": rgb.red, "green": rgb.green, "blue": rgb.blue};
		this._hex = hex;
	}

	// HSV
	public get hsvHue() { return this._hsv.hue; }
	public set hsvHue(hue: number) {
		if (Colour.rangeIsValid(hue, Colour._valueRanges.hue.min, Colour._valueRanges.hue.max)) {
			this._hsv.hue = hue;
			this.updateModelsFromHSVChanges();
		} else {
			const valueRange: ValueRange = Colour._valueRanges.hue;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("HSV 'hue'", valueRange.min, valueRange.max, hue));
		}
	}

	public get hsvSaturation() { return this._hsv.saturation; }
	public set hsvSaturation(saturation: number) {
		if (Colour.rangeIsValid(saturation, Colour._valueRanges.saturation.min, Colour._valueRanges.saturation.max)) {
			this._hsv.saturation = saturation;
			this.updateModelsFromHSVChanges();
		} else {
			const valueRange: ValueRange = Colour._valueRanges.saturation;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("HSV 'saturation'", valueRange.min, valueRange.max, saturation));
		}
	}

	public get hsvValue() { return this._hsv.value; }
	public set hsvValue(value: number) {
		if (Colour.rangeIsValid(value, Colour._valueRanges.value.min, Colour._valueRanges.value.max)) {
			this._hsv.value = value;
			this.updateModelsFromHSVChanges();
		} else {
			const valueRange: ValueRange = Colour._valueRanges.value;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("HSV 'value'", valueRange.min, valueRange.max, value));
		}
	}

	private get hsv() { return {"hue": this._hsv.hue, "saturation": this._hsv.saturation, "value": this._hsv.value} }
	private set hsv(hsv: {"hue": number, "saturation": number, "value": number}) {
		this._hsv.hue = hsv.hue;
		this._hsv.saturation = hsv.saturation;
		this._hsv.value = hsv.value;
		this.updateModelsFromHSVChanges();
	}

	// RGB
	public get rgbRed() { return this._rgb.red; }
	public set rgbRed(red: number) {
		if (Colour.rangeIsValid(red, Colour._valueRanges.red.min, Colour._valueRanges.red.max)) {
			this._rgb.red = red;
			this.updateModelsFromRGBChanges();
		} else {
			const valueRange: ValueRange = Colour._valueRanges.red;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("RGB 'red'", valueRange.min, valueRange.max, red));
		}
	}

	public get rgbGreen() { return this._rgb.green; }
	public set rgbGreen(green: number) {
		if (Colour.rangeIsValid(green, Colour._valueRanges.green.min, Colour._valueRanges.green.max)) {
			this._rgb.green = green;
			this.updateModelsFromRGBChanges();
		} else {
			const valueRange: ValueRange = Colour._valueRanges.green;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("RGB 'green'", valueRange.min, valueRange.max, green));
		}
	}

	public get rgbBlue() { return this._rgb.blue; }
	public set rgbBlue(blue: number) {
		if (Colour.rangeIsValid(blue, Colour._valueRanges.blue.min, Colour._valueRanges.blue.max)) {
			this._rgb.blue = blue;
			this.updateModelsFromRGBChanges();
		} else {
			const valueRange: ValueRange = Colour._valueRanges.blue;
			throw new ColourError(Colour.buildOutOfRangeArgMessage("RGB 'blue'", valueRange.min, valueRange.max, blue));
		}
	}

	private get rgb() { return {"red": this._rgb.red, "green": this._rgb.green, "blue": this._rgb.blue} }
	private set rgb(rgb: {"red": number, "green": number, "blue": number}) {
		this._rgb.red = rgb.red;
		this._rgb.green = rgb.green;
		this._rgb.blue = rgb.blue;
		this.updateModelsFromRGBChanges();
	}

	public get hex(): string { return this._hex; }
	public set hex(hex: string) {
		let formattedHex = hex;
		if (hex.charAt(0) === '#') {
			formattedHex = '#' + hex;
		}

		if (formattedHex.match(/^#[A-Fa-f\d]{6}$/)) {
			this._hex = formattedHex.toUpperCase();
			this.updateModelsFromHexChanges();
		} else {
			throw new ColourError(Colour.buildMismatchedArgErrorMessage("HEX code", "digits and letters A-F", hex));
		}
	}

	public toString(): string {
		return `Colour:\n` +
		       `\thsv(${this.hsvHue.toFixed(2)} ${this.hsvSaturation.toFixed(2)}% ${this.hsvValue.toFixed(2)}%)\n` +
		       `\trgb(${this.rgbRed} ${this.rgbGreen} ${this.rgbBlue})\n` +
		       `\thex: ${this.hex}`;
	}

	//https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
	private static hsvToRGB(hsv: {"hue": number, "saturation": number, "value": number}): {"red": number, "green": number, "blue": number} {
		const hueNormalised: number = hsv.hue / 60;
		const chromaNormalised: number = (hsv.saturation * hsv.value) / (100**2);
		const hueAdjustment: number = (1 - Math.abs((hueNormalised % 2) - 1)) * chromaNormalised;
		let red: number = 0, green: number = 0, blue: number = 0;

		if (0<=hueNormalised && hueNormalised<1) {          // #HiLo00
			red = chromaNormalised;
			green = hueAdjustment;
		} else if (1<=hueNormalised && hueNormalised<2) {   // #LoHi00
			green = chromaNormalised;
			red = hueAdjustment;
		} else if (2<=hueNormalised && hueNormalised<3) {   // #00HiLo
			green = chromaNormalised;
			blue = hueAdjustment;
		} else if (3<=hueNormalised && hueNormalised<4) {   // #00LoHi
			blue = chromaNormalised;
			green = hueAdjustment;
		} else if (4<=hueNormalised && hueNormalised<5) {   // #Lo00Hi
			blue = chromaNormalised;
			red = hueAdjustment;
		} else if (5<=hueNormalised && hueNormalised<6) {   // #Hi00Lo
			red = chromaNormalised;
			blue = hueAdjustment;
		} else {
			throw new ColourError(`Attempted to normalise HSV 'hue' value when converting HSV model to RGB, but value is out of the range 0-6: ${hueNormalised}`);
		}

		const valueAdjustment: number = (hsv.value / 100) - chromaNormalised;
		red = Math.round((red + valueAdjustment) * 255);
		green = Math.round((green + valueAdjustment) * 255);
		blue = Math.round((blue + valueAdjustment) * 255);

		let outOfRangeVals: string[] = [];
		if (Colour.rangeIsValid(red, 0, 255)) {
			outOfRangeVals.push("red");
		}
		if (Colour.rangeIsValid(green, 0, 255)) {
			outOfRangeVals.push("green");
		}
		if (Colour.rangeIsValid(blue, 0, 255)) {
			outOfRangeVals.push("blue");
		}

		if (outOfRangeVals.length > 0) {
			let errorMessage: string = `Attempted to convert HSV model to RGB, but ` +
			                           `${outOfRangeVals.length} computed RGB value${outOfRangeVals.length>1?"s are":" is "}` +
			                           `out of the range 0-255: {r: ${red}, g: ${green}, b: ${blue}}`;
			throw new ColourError(errorMessage);
		}

		return {"red": red, "green": green, "blue": blue};
	}

	//https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
	private static rgbToHSV(rgb: {"red": number, "green": number, "blue": number}): {"hue": number, "saturation": number, "value": number} {
		const rgbNormalised: {"red": number, "green": number, "blue": number} = {"red": rgb.red/255, "green": rgb.green/255, "blue": rgb.blue/255};
		const valueNormalised: number = Math.max(rgbNormalised.red, rgbNormalised.green, rgbNormalised.blue);
		const valueChromaDifference: number = Math.min(rgbNormalised.red, rgbNormalised.green, rgbNormalised.blue);
		const chromaNormalised: number = valueNormalised - valueChromaDifference;
		const saturationNormalised: number = valueNormalised===0? 0: chromaNormalised/valueNormalised;

		let hueNormalised: number = 0;
		if (chromaNormalised===0) {
			hueNormalised = 0;
		} else if (valueNormalised===rgbNormalised.red) {
			hueNormalised = (((rgbNormalised.green - rgbNormalised.blue) / chromaNormalised) + 6) % 6; // I hate javascript ((((:
		} else if (valueNormalised===rgbNormalised.green) {
			hueNormalised = ((rgbNormalised.blue - rgbNormalised.red) / chromaNormalised) + 2;
		} else if (valueNormalised===rgbNormalised.blue) {
			hueNormalised = ((rgbNormalised.red - rgbNormalised.green) / chromaNormalised) + 4;
		} else {
			throw new ColourError(`Something went terribly wrong: attempted to compute HSV 'value' value when converting RGB model to HSV, ` +
			                      `but is equal to neither red, green, nor blue, despite being assigned from the largest number of the three.`);
		}

		let hue: number = hueNormalised*60, saturation: number = saturationNormalised*100, value: number = valueNormalised*100;
		let outOfRangeVals: string[] = [];
		if (Colour.rangeIsValid(hue, 0, 360)) {
			outOfRangeVals.push("hue");
		}
		if (Colour.rangeIsValid(saturation, 0, 100)) {
			outOfRangeVals.push("saturation");
		}
		if (Colour.rangeIsValid(value, 0, 100)) {
			outOfRangeVals.push("value");
		}

		if (outOfRangeVals.length > 0) {
			let errorMessage: string = `Attempted to convert RGB model to HSV, but ` +
			                           `${outOfRangeVals.length} computed HSV value${outOfRangeVals.length>1?"s are":" is "}` +
			                           `out of range (hue: 0-360, saturation and value: 0-100): {hue: ${hue}, sat: ${saturation}, val: ${value}}`;
			throw new ColourError(errorMessage);
		}

		return {"hue": hue, "saturation": saturation, "value": value}
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

	private updateModelsFromHexChanges(): void {
		this._rgb = Colour.hexToRGB(this.hex);
		this._hsv = Colour.rgbToHSV(this.rgb);
	}

	private updateModelsFromRGBChanges(): void {
		this._hsv = Colour.rgbToHSV(this.rgb);
		this._hex = Colour.rgbToHex(this.rgb);
	}

	private updateModelsFromHSVChanges(): void {
		this._rgb = Colour.hsvToRGB(this.hsv);
		this._hex = Colour.rgbToHex(this.rgb);
	}

	// I wanted to name this inValidRange, but I realised that, unless you verify its behaviour by looking at the camel case,
	// it can look like it's called 'invalidRange', as in the opposite of what it's actually accomplishing 😭😭
	private static rangeIsValid(num: number, min: number, max: number):boolean {
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
