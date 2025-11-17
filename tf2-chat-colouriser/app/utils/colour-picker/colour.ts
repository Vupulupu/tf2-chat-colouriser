export class Colour {
	private _hsv: {"hue": number, "saturation": number,"value": number};
	private _rgb: {"red": number, "green": number, "blue": number};
	private _hex: string;

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
		//TODO: construct obj using passed-in arguments
		this._hsv = {"hue": 0, "saturation": 0, "value": 0}
		this._rgb = {"red": 0, "green": 0, "blue": 0};
		this._hex = "";
	}

	// HSV
	get hsv(): {"hue": number, "saturation": number, "value": number} {
		//TODO: return populated hsv obj
		return { "hue": 0, "saturation": 0, "value": 0 };
	}
	private set hsv(hsv: {"hue": number, "saturation": number, "value": number}) {
		//TODO: parse(?) and set hsv members
	}

	set hsvHue(hue: number) {
		//TODO: parse hue, ensuring values are clamped
	}

	set hsvSaturation(saturation: number) {
		//TODO: parse saturation, ensuring values are clamped
	}

	set hsvValue(value: number) {
		//TODO: parse value, ensuring values are clamped
	}

	// RGB
	get rgb(): {"red": number, "green": number, "blue": number} {
		//TODO: return populated rgb obj
		return { "red": 0, "green": 0, "blue": 0 };
	}
	private set rgb(rgb: {"red": number, "green": number, "blue": number}) {
		//TODO: parse(?) and set rgb members
	}

	set rgbRed(red: number) {
		//TODO: parse red, ensuring values are clamped
	}

	set rgbGreen(green: number) {
		//TODO: parse green, ensuring values are clamped
	}

	set rgbBlue(blue: number) {
		//TODO: parse blue, ensuring values are clamped
	}

	get hex(): string {
		//TODO: return hex
		return "";
	}
	set hex(hex: string) {
		//TODO: parse and validate hex
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
}
