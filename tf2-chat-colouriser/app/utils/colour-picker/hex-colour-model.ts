import { ColourCode } from "~/utils/colour-picker/colour-code";
import { ColourError } from "~/utils/colour-picker/colour-error";

export class HexColourModel {
	private _code: ColourCode;
	private _is4Bit: boolean;

	constructor(code: string) {
		this._is4Bit = this._parseIs4Bit(code);
		this._code = this._parseRawCode(code);
	}

	private _getRawCode(code: string): string {
		return code.charAt(0)==='#'? code.slice(1): code;
	}
	public getCode(): ColourCode {
		return this._code.clone() }
	public get8BitCode(): ColourCode {
		let rawCode: string = this._getRawCode(this._code.value);
		if (this._is4Bit) {
			rawCode = rawCode.charAt(0)+rawCode.charAt(0)+rawCode.charAt(1)+rawCode.charAt(1)+rawCode.charAt(2)+rawCode.charAt(2);
		}

		return new ColourCode("Hex", `#${rawCode}`, /^#[A-Fa-f\d]{6}$/);
	}
	public setCode(code: string): void {
		this._is4Bit = this._parseIs4Bit(code);
		this._code = this._parseRawCode(code);
	}

	private _parseIs4Bit(code: string): boolean {
		let rawCode: string = this._getRawCode(code);
		if (rawCode.length==6) {
			return false;
		} else if (rawCode.length==3) {
			return true;
		} else {
			throw new ColourError(`Attempted to set the hex code's value, but the value was an invalid length ` +
				`Hex code must be 3 chars (4-bit) or 6 chars (8-bit), ` +
				`but argument was ${rawCode.length} chars long: #${rawCode}.`);
		}
	}

	private _parseRawCode(code: string): ColourCode {
		let rawCode: string = this._getRawCode(code);
		if (this._is4Bit) {
			return new ColourCode("Hex", `#${rawCode}`, /^#[A-Fa-f\d]{3}$/);
		} else {
			return new ColourCode("Hex", `#${rawCode}`, /^#[A-Fa-f\d]{6}$/);
		}
	}

	public clone(): HexColourModel {
		return new HexColourModel(this._code.value);
	}
}
