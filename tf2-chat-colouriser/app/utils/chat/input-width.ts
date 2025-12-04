import { EditorComponents } from "~/utils/chat/editor-components";

const INITIAL_INPUT_ANIMATION_DURATION_MS: number = 750;
const INPUT_WIDTH_PADDING: number = 25;

export function animateExpandStartingInput(components: EditorComponents, inputWidthStyleBinding: Ref<string, string>): void {
	components.messageInput.style.transition = `width ${INITIAL_INPUT_ANIMATION_DURATION_MS}ms ease,` +
		`min-width ${INITIAL_INPUT_ANIMATION_DURATION_MS}ms ease,` +
		`outline ${INITIAL_INPUT_ANIMATION_DURATION_MS}ms ease`;

	inputWidthStyleBinding.value = (components.messageLabel.offsetWidth - components.sayText.offsetWidth) + "px";

	setTimeout(() => {
		components.messageInput.style.transition = "";
	}, INITIAL_INPUT_ANIMATION_DURATION_MS);
}

export function autoResizeInput(components: EditorComponents): void {
	components.messageMirror.innerHTML = components.messageInput.value;
	components.messageWidth.innerHTML = components.messageInput.value.replace(/\s/g, "&nbsp;");
	const newWidth: number = components.messageWidth.offsetWidth + INPUT_WIDTH_PADDING;
	components.messageInput.style.width = `${newWidth}px`;
	components.messageMirror.style.width = `${newWidth}px`;
}
