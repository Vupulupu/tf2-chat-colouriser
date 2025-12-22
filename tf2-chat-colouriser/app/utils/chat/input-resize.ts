import { EditorComponents } from "~/utils/chat/editor-components";

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

export function resizeInputComponent(components: EditorComponents): void {
	const newWidth: number = components.messageWidth.offsetWidth + INPUT_WIDTH_PADDING;
	components.messageInput.style.width = `${newWidth}px`;
	components.messageMirror.style.width = `${newWidth}px`;
}

export function parseSelectionRect(input: HTMLInputElement, textMirror: HTMLElement): Range | null {
	let selectionRange: Range | null = null;
	if (textMirror.firstChild && input.selectionStart!==input.selectionEnd) {
		const mirrorContent: Node = textMirror.firstChild as Node;
		const startIndex: number = input.selectionStart ?? 0;
		const endIndex: number = input.selectionEnd ?? 0;
		const mirrorRange: Range = document.createRange();
		mirrorRange.setStart(mirrorContent, startIndex);
		mirrorRange.setEnd(mirrorContent, endIndex);
		selectionRange = mirrorRange;
	}

	return selectionRange;
}
