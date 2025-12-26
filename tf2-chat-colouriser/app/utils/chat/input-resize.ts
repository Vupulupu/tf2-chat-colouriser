
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
