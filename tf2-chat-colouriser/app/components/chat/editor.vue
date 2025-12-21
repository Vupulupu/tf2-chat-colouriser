<script setup lang="ts">
	import { EditorComponents } from "~/utils/chat/editor-components";
	import * as InputResize from "~/utils/chat/input-resize";
	import { ColouredSubstring } from "~/utils/chat/coloured-substring";
	import { tfStyleTextShadow } from "~/utils/chat/compute-styles";

	const editorComponents: EditorComponents = new EditorComponents(useTemplateRef("message-label"),
	                                                                useTemplateRef("say-text"),
	                                                                useTemplateRef("message-input"),
	                                                                useTemplateRef("message-input-mirror"),
	                                                                useTemplateRef("message-raw-width"));
	const minInputWidth: Ref<string> = useState("min-input-width", () => "0");
	const sayTextWidth: Ref<string> = useState("say-text-width", () => "0");
	const inputSelectRect: Ref<DOMRect | null> = useState("input-select-rect", () => null);
	const pickerIsOpen: Ref<boolean> = useState("picker-is-open", () => false);
	const colouredRanges: Ref<ColouredSubstring[]> = useState("coloured-ranges", () => []);

	const colourOptionSize: string = "50px";
	const colourOptionTailWidth: string = "15px";
	const colourOptionTailHeight: string = "20px";
	const colourOptionTailOffset: ComputedRef<string> = computed(() => {
		if (!inputSelectRect.value || !editorComponents.messageInput) return "0";
		else {
			const inputCenter: number = editorComponents.messageInput.getBoundingClientRect().left+(editorComponents.messageInput.offsetWidth/2);
			const offsetFromCentre: number = inputSelectRect.value.left+(inputSelectRect.value.width/2)-inputCenter;
			return `${offsetFromCentre/(editorComponents.messageInput.offsetWidth/2) * 10}px`
		}
	});
	const selectionPositionCentreX: ComputedRef<string> = computed(() => {
		if (!inputSelectRect.value) return "0";
		else return `clamp(2rem,` +
			`${inputSelectRect.value.left + (inputSelectRect.value.width/2) - parseInt(colourOptionTailOffset.value)}px,` +
			`calc(100dvw - ${colourOptionSize}))`;
	});
	const selectionPositionTopY: ComputedRef<string> = computed(() => {
		if (!inputSelectRect.value) return "0";
		else return `${(inputSelectRect.value.top - parseInt(colourOptionTailHeight) - 10)}px`;
	});

	onMounted(() => {
		minInputWidth.value = `${(editorComponents.messageLabel.offsetWidth - editorComponents.sayText.offsetWidth)}px`;
		InputResize.animateExpandStartingInput(editorComponents, minInputWidth);
		sayTextWidth.value = `${editorComponents.sayText.offsetWidth}px`;

		editorComponents.messageInput.addEventListener("selectionchange", () => {
			inputSelectRect.value = InputResize.parseSelectionRect(editorComponents.messageInput, editorComponents.messageMirror);
		});
	});

	function resizeMessage(): void {
		InputResize.resizeInputComponent(editorComponents);
	}
</script>

<template>
	<div id="editor">
		<label for="message-input" ref="message-label" class="message-label"
		       :style="{ textShadow: tfStyleTextShadow('var(--tf2-chat-colour)', -1, -1, 2) }">
			Chat Message
		</label>
		<div class="chat-container">
			<span ref="say-text" class="say-text">Say :</span>
			<span id="message-input">
				<input ref="message-input" type="text" value=""
				       @input="resizeMessage" @resize="resizeMessage" />
				<span class="message-mirror" ref="message-input-mirror"></span>
			</span>
			<p ref="message-raw-width" class="message-width">-</p>
		</div>
		<p id="message-byte-length" ref="message-byte-length"
		   :style="{ textShadow: tfStyleTextShadow('var(--tf2-shadow-colour)', -1, 0) }">
			0/127 bytes used
		</p>
		<template v-if="inputSelectRect">
			<div class="overlay" @mousedown="inputSelectRect=null;"></div>
			<div class="tailed-button">
				<div class="init-grow-wrapper">
					<button @click="inputSelectRect=null; pickerIsOpen=true;">colour-ise</button>
					<LeadingTail :width="colourOptionTailWidth" :height="colourOptionTailHeight" colour="var(--tf2-shadow-colour)"
					             :style="{ position: `absolute`,
				                           left: `calc(50% - (${colourOptionTailWidth} / 2) + ${colourOptionTailOffset}` }" />
				</div>
			</div>
		</template>
		<ColourPicker v-if="pickerIsOpen"
		              @colour-cancelled="pickerIsOpen=false;"
		              @colour-set="() => { pickerIsOpen=false; }" />
	</div>
</template>

<style scoped>
	#editor {
		display: inline-grid;
		align-self: center;
		font-family: "tf2 secondary", "serif";
	}

	.message-label {
		color: var(--tf2-shadow-colour);
		text-align: left;
		letter-spacing: 1px;
	}

	#message-byte-length {
		font-size: calc(var(--main-font-size) * .75);
		text-align: right;
		font-weight: bold;
	}

	#message-input>*,
	.chat-container,
	.message-width {
		box-sizing: border-box;
		font-family: "verdana", "sans-serif";
		font-weight: bold;
		font-size: var(--verdana-font-size);
	}

	#message-input>*,
	.say-text {
		padding: 5px 10px calc(5px + .1em) 10px;
		text-shadow: hsla(var(--hsl-black) / 50%) 2px 2px 1px;
	}

	#message-input>*,
	.message-width {
		max-width: calc(95dvw - v-bind(sayTextWidth));
		overflow: hidden;
	}

	.message-mirror,
	.message-width {
		position: absolute;
		left: 0;
		opacity: 0;
		user-select: none;
		pointer-events: none;
	}

	#message-input {
		position: relative;
		&>input {
			&:focus-visible, &:focus-within {
				background: hsla(var(--hsl-black) / 10%);
				outline: 3px solid var(--tf2-chat-selection-colour);
			}
		}
		&>* {
			min-width: v-bind(minInputWidth);
			width: v-bind(minInputWidth);
			padding: 5px 10px calc(5px + .1em) 10px;
			color: var(--tf2-chat-colour);
			text-align: center;
			background: none;
			border: none;
			border-top-right-radius: 10px;
			border-bottom-right-radius: 10px;
		}
	}

	.chat-container,
	.say-text {
		--container-border-style: 2px solid hsla(var(--hsl-white) / 50%);
	}

	.chat-container {
		margin: 5px 0;
		justify-self: center;
		box-sizing: border-box;
		font-weight: bold;
		background: hsla(var(--hsl-black) / 40%);
		border: var(--container-border-style);
		border-radius: 10px;
		box-shadow: hsla(var(--hsl-black) / 50%) 1px 1px 4px,
		            hsla(var(--hsl-black) / 30%) 3px 3px 7px,
		            hsla(var(--hsl-black) / 10%) 5px 5px 10px;
	}

	.say-text {
		padding-right: 5px;
		border-right: var(--container-border-style);
		user-select: none;
	}

	.message-width {
		min-width: var(--input-width)px;
	}

	.tailed-button {
		position: absolute;
		z-index: 1;
		left: v-bind(selectionPositionCentreX);
		top: v-bind(selectionPositionTopY);
		transform: translate(-50%, -100%);
		transition: left .1s ease;

		& .init-grow-wrapper {
			transform-origin: 50% calc(100% + v-bind(colourOptionTailHeight));
			animation: init-grow .6s ease 1;
		}

		& button {
			width: v-bind(colourOptionSize);
			height: v-bind(colourOptionSize);
			transition: transform .3s ease;
			&:hover {
				transform-origin: bottom;
				transform: scale(105%);
			}
		}
	}

	@media only screen and (max-width: 320px) {
		#message-input {
			min-width: 0;
		}
	}
</style>
