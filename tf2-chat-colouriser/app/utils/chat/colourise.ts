import { ColouredRange } from "~/utils/chat/coloured-range";
import { IndexRange } from "~/utils/chat/index-range";

/*
if a colourised range starts inside new range, move start to end of new range.
if a colourised range ends inside new range, move end to start of new range.
if a colourised range is entirely included inside new range, delete/replace it.
*/
export function applyColour(newRange: ColouredRange, colouredRanges: Ref<ColouredRange[]>): void {
	adjustColoursAroundRange(newRange, colouredRanges);
	colouredRanges.value.push(newRange);
	colouredRanges.value.sort((a: ColouredRange, b: ColouredRange) => { return a.compare(b) });
}

export function adjustColoursAroundRange(range: IndexRange, colouredRanges: Ref<ColouredRange[]>): void {
	for (let i:number=0; i<colouredRanges.value.length; i++) {
		const currRange: ColouredRange | undefined = colouredRanges.value[i];
		if (currRange) {
			if (range.subsumes(currRange)) {
				colouredRanges.value = colouredRanges.value.toSpliced(i--, 1);
			} else if (currRange.includes(range)) {
				currRange.endIndex = range.startIndex;
				colouredRanges.value.splice(i+1, 0, new ColouredRange(currRange.colourHex, range.endIndex, currRange.endIndex));
			} else if (currRange.contains(range.startIndex)) {
				currRange.endIndex = range.startIndex;
			} else if (currRange.contains(range.endIndex)) {
				currRange.startIndex = range.endIndex;
			}
		}
	}
}

/*
if selection is before range, offset range indices by change.
if selection subsumes range (subset of indices), delete range.
if range includes selection (proper subset, starts & ends !=), move end of range to end+change.
if start in but end not in range (including range's end), move end of range to start+max(change,0).
if start not but end in range, move start of range to end+change.
*/
export function updateColour(strChange: number, colouredRanges: Ref<ColouredRange[]>, selection: IndexRange ): void {
	selection.startIndex = Math.max(selection.startIndex, 0);
	if (selection.endIndex < selection.startIndex) selection.endIndex = selection.startIndex;
	for (let i:number=0; i<colouredRanges.value.length; i++) {
		const currRange: ColouredRange | undefined = colouredRanges.value[i];
		if (currRange) {
			if (selection.endIndex <= currRange.startIndex) {
				// selection is entirely before range
				currRange.startIndex += strChange;
				currRange.endIndex += strChange;
			} else if (selection.subsumes(currRange)) {
				// selection entirely surrounds range (or is exactly equal)
				colouredRanges.value = colouredRanges.value.toSpliced(i--, 1)
			} else if (currRange.includes(selection)) {
				// selection is entirely within range (both start and end)
				currRange.endIndex += strChange;
			} else if (currRange.contains(selection.startIndex)) {
				// only selection's start is within range (because previous branch implies end isn't
				currRange.endIndex = selection.startIndex + Math.max(selection.length() + strChange, 0);
			} else if (currRange.contains(selection.endIndex)) {
				// only selection's end is within range (because previous branches imply start isn't
				currRange.startIndex = selection.endIndex + strChange;
			} else if (selection.endIndex===currRange.endIndex) {
				// special branch when selection (start & end) is directly after range
				// start index is implied to equal the end because it is not before or within the range
				currRange.endIndex = selection.startIndex + strChange;
			} else if (selection.startIndex===currRange.endIndex) {
				// special special branch when only selection's start is directly after range
				currRange.endIndex += selection.length() + strChange;
			}
		}
	}
}
