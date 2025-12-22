import { HexColourModel } from "~/utils/colour-picker/hex-colour-model";

export class ColouredSubstring {
	private COLOUR_HEX: HexColourModel;
	public startIndex: number;
	public endIndex: number;

	public constructor(colourHexStr: string, startIndex: number, endIndex: number) {
		this.COLOUR_HEX = new HexColourModel(colourHexStr);

		if (startIndex > endIndex) {
			const temp: number = startIndex;
			startIndex = endIndex;
			endIndex = temp;
		}
		this.startIndex = startIndex;
		this.endIndex = endIndex;
	}

	public get colourHex(): string {
		return this.COLOUR_HEX.getCode().value;
	}

	public set colourHex(hexStr: string) {
		this.COLOUR_HEX.setCode(hexStr);
	}

	public subsumes(compareRange: {startIndex:number, endIndex:number}): boolean {
		return (this.startIndex <= compareRange.startIndex && this.endIndex >= compareRange.endIndex);
	}

	public contains(compareIndex: number): boolean {
		return (this.startIndex < compareIndex && this.endIndex > compareIndex);
	}

	public compare(compareSubstr: ColouredSubstring): number {
		if (this.startIndex === compareSubstr.startIndex) {
			return this.endIndex - compareSubstr.endIndex;
		} else {
			return this.startIndex - compareSubstr.startIndex;
		}
	}
}
