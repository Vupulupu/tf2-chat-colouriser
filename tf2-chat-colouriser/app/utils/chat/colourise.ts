import { ColouredSubstring } from "~/utils/chat/coloured-substring";

/*
if a colourised range starts inside new range, move start to end of new range.
if a colourised range ends inside new range, move end to start of new range.
if a colourised range is entirely included inside new range, delete/replace it.
*/
export function applyColour(newSubstr: ColouredSubstring, colourisedRanges: ColouredSubstring[]): void {
	for (let i in colourisedRanges) {
		const currRange: ColouredSubstring | undefined = colourisedRanges[i];
		if (currRange) {
			if (newSubstr.includes(currRange)) {
				colourisedRanges = colourisedRanges.splice(Number(i), 1);
			} else if (currRange.contains(newSubstr.startIndex)) {
				currRange.endIndex = newSubstr.startIndex;
			} else if (currRange.contains(newSubstr.endIndex)) {
				currRange.startIndex = newSubstr.endIndex;
			}
		}
	}

	colourisedRanges.push(newSubstr);
}
