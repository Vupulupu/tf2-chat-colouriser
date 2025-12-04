export function openColourOptions(input: HTMLInputElement, textMirror: HTMLElement): DOMRect {
	let selectionRect: DOMRect = new DOMRect();
	if (textMirror.firstChild) {
		const mirrorContent: Node = textMirror.firstChild as Node;
		const startIndex: number = input.selectionStart ?? 0;
		const endIndex: number = input.selectionEnd ?? 0;
		const mirrorRange = document.createRange();
		mirrorRange.setStart(mirrorContent, startIndex);
		mirrorRange.setEnd(mirrorContent, endIndex);
		selectionRect = mirrorRange.getBoundingClientRect();
	}

	return selectionRect;
}
