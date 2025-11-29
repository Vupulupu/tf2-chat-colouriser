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
	components.messageWidthSpan.innerHTML = components.messageInput.value.replace(/\s/g, "&nbsp;");
	components.messageInput.style.width = (components.messageWidthSpan.offsetWidth + INPUT_WIDTH_PADDING) + "px";
}
