import { HexColourModel } from "~/utils/colour-picker/hex-colour-model";
import { IndexRange } from "~/utils/chat/index-range";

export class ColouredRange extends IndexRange {
	private COLOUR_HEX: HexColourModel;

	public constructor(colourHexStr: string, startIndex: number, endIndex: number) {
		super(startIndex, endIndex);
		this.COLOUR_HEX = new HexColourModel(colourHexStr);
	}

	public get colourHex(): string {
		return this.COLOUR_HEX.getCode().value;
	}

	public set colourHex(hexStr: string) {
		this.COLOUR_HEX.setCode(hexStr);
	}

	public override clone(): ColouredRange {
		return new ColouredRange(this.colourHex, this.startIndex, this.endIndex);
	}
}
