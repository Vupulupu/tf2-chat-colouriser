import { EditorComponents } from "~/utils/chat/editor-components";
import type { IndexRange } from "~/utils/chat/index-range";

const INIT_INPUT_ANIMATION_DURATION: number = 750;
const INPUT_WIDTH_PADDING: number = 25;

export function animateExpandStartingInput(components: EditorComponents, inputWidthStyleBinding: Ref<string, string>): void {
	components.messageInput.style.transition = `width ${INIT_INPUT_ANIMATION_DURATION}ms ease,` +
		`min-width ${INIT_INPUT_ANIMATION_DURATION}ms ease,` +
		`outline ${INIT_INPUT_ANIMATION_DURATION}ms ease`;

	inputWidthStyleBinding.value = (components.messageLabel.offsetWidth - components.sayText.offsetWidth) + "px";

	setTimeout(() => {
		components.messageInput.style.transition = "";
	}, INIT_INPUT_ANIMATION_DURATION);
}

export function parseSelectionRect(selection: IndexRange, textMirror: HTMLElement): Range | null {
	let selectionRange: Range | null = null;
	if (textMirror.firstChild && selection.startIndex!==selection.endIndex) {
		const mirrorContent: Node = textMirror.firstChild as Node;
		const startIndex: number = selection.startIndex ?? 0;
		const endIndex: number = selection.endIndex ?? 0;
		const mirrorRange: Range = document.createRange();
		mirrorRange.setStart(mirrorContent, startIndex);
		mirrorRange.setEnd(mirrorContent, endIndex);
		selectionRange = mirrorRange;
	}

	return selectionRange;
}
