import { HsvColourModel } from "~/utils/colour-picker/hsv-colour-model";
import { RgbColourModel } from "~/utils/colour-picker/rgb-colour-model";
import { HexColourModel } from "~/utils/colour-picker/hex-colour-model";
import { ColourError } from "~/utils/colour-picker/colour-error";

export interface Colour {
	hsv: HsvColourModel,
	rgb: RgbColourModel,
	hex: HexColourModel,
}

export function createFromHex(code: string): Colour {
	let hex: HexColourModel = new HexColourModel(code);
	let rgb: RgbColourModel = hexToRgb(hex);
	let hsv: HsvColourModel = rgbToHsv(rgb);
	return { hsv: hsv, rgb: rgb, hex: hex };
}

export function createFromRGB(red: number, green: number, blue: number): Colour {
	let rgb: RgbColourModel = new RgbColourModel(red, green, blue);
	let hsv: HsvColourModel = rgbToHsv(rgb);
	let hex: HexColourModel = rgbToHex(rgb);
	return { hsv: hsv, rgb: rgb, hex: hex };
}

export function createFromHSV(hue: number, saturation: number, value: number): Colour {
	let hsv: HsvColourModel = new HsvColourModel(hue, saturation, value);
	let rgb: RgbColourModel = hsvToRgb(hsv);
	let hex: HexColourModel = rgbToHex(rgb);
	return { hsv: hsv, rgb: rgb, hex: hex };
}

//https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
export function hsvToRgb(hsv: HsvColourModel): RgbColourModel {
	const hueNormalised: number = hsv.getHue().value / 60;
	const chromaNormalised: number = (hsv.getSaturation().value * hsv.getValue().value) / (100**2);
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

	const valueAdjustment: number = (hsv.getValue().value / 100) - chromaNormalised;
	red = Math.round((red + valueAdjustment) * 255);
	green = Math.round((green + valueAdjustment) * 255);
	blue = Math.round((blue + valueAdjustment) * 255);

	return new RgbColourModel(red, green, blue);
}

//https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
export function rgbToHsv(rgb: RgbColourModel): HsvColourModel {
	const rgbNormalised: {red: number, green: number, blue: number} = {
		red: rgb.getRed().value/255,
		green: rgb.getGreen().value/255,
		blue: rgb.getBlue().value/255,
	};
	const valueNormalised: number = Math.max(rgbNormalised.red, rgbNormalised.green, rgbNormalised.blue);
	const valueChromaDifference: number = Math.min(rgbNormalised.red, rgbNormalised.green, rgbNormalised.blue);
	const chromaNormalised: number = valueNormalised - valueChromaDifference;
	const saturationNormalised: number = valueNormalised===0? 0: chromaNormalised/valueNormalised;

	let hueNormalised: number;
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
	return new HsvColourModel(hue, saturation, value);
}

export function rgbToHex(rgb: RgbColourModel): HexColourModel {
	let hex: string = "#", redHex: string, greenHex: string, blueHex: string;
	redHex = rgb.getRed().value.toString(16).padStart(2, '0');
	greenHex = rgb.getGreen().value.toString(16).padStart(2, '0');
	blueHex = rgb.getBlue().value.toString(16).padStart(2, '0');
	hex += redHex + greenHex + blueHex;
	return new HexColourModel(hex.toUpperCase());
}

export function hexToRgb(hex: HexColourModel): RgbColourModel {
	let red: number, green: number, blue: number;
	let rawHex: string = hex.get8BitCode().value.slice(1);
	red = parseInt(rawHex.slice(0, rawHex.length/3), 16);
	green = parseInt(rawHex.slice(rawHex.length/3, rawHex.length*2/3), 16);
	blue = parseInt(rawHex.slice(rawHex.length*2/3), 16);
	return new RgbColourModel(red, green, blue);
}
