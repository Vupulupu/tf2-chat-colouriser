import { ColouredRange } from "~/utils/chat/coloured-range";

/*
if a colourised range starts inside new range, move start to end of new range.
if a colourised range ends inside new range, move end to start of new range.
if a colourised range is entirely included inside new range, delete/replace it.
*/
export function applyColour(newSubstr: ColouredRange, colourisedRanges: Ref<ColouredRange[]>): void {
	for (let i:number=0; i<colourisedRanges.value.length; i++) {
		const currRange: ColouredRange | undefined = colourisedRanges.value[i];
		if (currRange) {
			if (newSubstr.subsumes(currRange)) {
				colourisedRanges.value = colourisedRanges.value.toSpliced(i--, 1);
			} else if (currRange.contains(newSubstr.startIndex)) {
				currRange.endIndex = newSubstr.startIndex;
			} else if (currRange.contains(newSubstr.endIndex)) {
				currRange.startIndex = newSubstr.endIndex;
			}
		}
	}

	colourisedRanges.value.push(newSubstr);
	colourisedRanges.value.sort((a: ColouredRange, b: ColouredRange) => { return a.compare(b) });
}
