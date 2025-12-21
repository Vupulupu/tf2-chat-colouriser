import { HexColourModel } from "~/utils/colour-picker/hex-colour-model";

export class ColouredSubstring {
	private COLOUR_HEX: HexColourModel;
	public startIndex: number;
	public endIndex: number;

	public constructor(colourHexStr: string, startIndex: number, endIndex: number) {
		this.COLOUR_HEX = new HexColourModel(colourHexStr);
		this.startIndex = startIndex;
		this.endIndex = endIndex;
	}

	public get colourHex(): string {
		return this.COLOUR_HEX.getCode().value;
	}

	public set colourHex(hexStr: string) {
		this.COLOUR_HEX.setCode(hexStr);
	}
}
