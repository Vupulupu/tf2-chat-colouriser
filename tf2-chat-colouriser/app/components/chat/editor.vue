<script setup lang="ts">
	import { tfStyleTextShadow } from "~/utils/chat/compute-styles";
	import { EditorComponents } from "~/utils/chat/editor-components";
	import MessagePreview from "~/components/chat/message-preview.vue";
	import * as InputResize from "~/utils/chat/input-resize";
	import type { Colour } from "~/utils/colour-picker/colour";
	import { IndexRange } from "~/utils/chat/index-range";
	import { ColouredRange } from "~/utils/chat/coloured-range";
	import * as Colourise from "~/utils/chat/colourise";
	import stringDifferenceLength from "~/utils/string-difference";

	const editorComponents: EditorComponents = new EditorComponents(useTemplateRef("message-label"),
	                                                                useTemplateRef("say-text"),
	                                                                useTemplateRef("message-input"),
	                                                                useTemplateRef("message-input-mirror"),
	                                                                useTemplateRef("message-raw-width"));
	const minInputWidth: Ref<string> = useState("min-input-width", () => "0");
	const inputWidth: Ref<string> = useState("input-width", () => "0");
	const inputScroll: Ref<number> = useState("input-scroll", () => 0);
	const sayTextWidth: Ref<string> = useState("say-text-width", () => "0");
	const inputContents: Ref<string> = useState("input-contents", () => "");
	const NBSP: string = ' '; // raw &nbsp; char to be use-able with any data binding
	const inputSelect: Ref<IndexRange> = useState("curr-input-selection", () => new IndexRange(0, 0));
	const inputSelectRange: Ref<Range | null> = computed(() => {
		if (editorComponents.messageMirror) return InputResize.parseSelectionRect(inputSelect.value, editorComponents.messageMirror)
		else return null;
	});
	const inputSelectRect: ComputedRef<DOMRect | null> = computed(() => {
		if (inputSelectRange.value) return inputSelectRange.value.getBoundingClientRect();
		else return null;
	});
	const pickerIsOpen: Ref<boolean> = useState("picker-is-open", () => false);
	const colouredRanges: Ref<ColouredRange[]> = useState("coloured-ranges", () => []);

	const COLOUR_OPTION_SIZE: string = "50px";
	const COLOUR_OPTION_TAIL_WIDTH: string = "15px";
	const COLOUR_OPTION_TAIL_HEIGHT: string = "20px";
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
			`calc(100dvw - ${COLOUR_OPTION_SIZE}))`;
	});
	const selectionPositionTopY: ComputedRef<string> = computed(() => {
		if (!inputSelectRect.value) return "0";
		else return `${(inputSelectRect.value.top - parseInt(COLOUR_OPTION_TAIL_HEIGHT) - 10)}px`;
	});

	onMounted(() => {
		minInputWidth.value = `${(editorComponents.messageLabel.offsetWidth - editorComponents.sayText.offsetWidth)}px`;
		InputResize.animateExpandStartingInput(editorComponents, minInputWidth);
		sayTextWidth.value = `${editorComponents.sayText.offsetWidth}px`;

		editorComponents.messageInput.addEventListener("selectionchange", () => {
			const inputEl: HTMLInputElement = editorComponents.messageInput;
			if (inputEl.selectionStart!==null && inputEl.selectionEnd!==null)
				inputSelect.value = new IndexRange(inputEl.selectionStart, inputEl.selectionEnd);
		});
	});

	function resizeMessage(): void {
		editorComponents.messageWidth.innerText = inputContents.value;
		const newWidth: number = editorComponents.messageWidth.scrollWidth;
		inputWidth.value = `${newWidth}px`;
	}

	function updateMirror() {
		const inputEl: HTMLInputElement = editorComponents.messageInput;
		Colourise.updateColour(stringDifferenceLength(inputContents.value, inputEl.value), colouredRanges, inputSelect.value);

		inputContents.value = inputEl.value.replace(/\s/g, NBSP);
		resizeMessage();
		updateMirrorScroll();
	}

	function updateMirrorScroll() {
		editorComponents.messageMirror.scrollLeft = editorComponents.messageInput.scrollLeft; //TODO:: remove once parseSelectionRect is refactored
		inputScroll.value = editorComponents.messageInput.scrollLeft;
	}

	function resetInputSelection() {
		editorComponents.messageInput.selectionStart = 0;
		editorComponents.messageInput.selectionEnd = 0;
	}

	function colouriseSubstring(colour: Colour) {
		if (inputSelectRange.value) {
			const startIndex: number = inputSelectRange.value.startOffset;
			const endIndex: number = inputSelectRange.value.endOffset;
			const newColouredRange: ColouredRange = new ColouredRange(colour.hex.getCode().value, startIndex, endIndex);
			Colourise.applyColour(newColouredRange, colouredRanges);
		}
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
				<input ref="message-input" type="text" value="" @scroll="updateMirrorScroll"
						@input="updateMirror" @resize="resizeMessage" />
				<span class="message-mirror" ref="message-input-mirror">{{inputContents}}</span>
				<MessagePreview class="message-mirror" :selection="inputSelect" :width="inputWidth" :scroll="inputScroll"
				                :coloured-ranges="colouredRanges" :message-content="inputContents" />
			</span>
			<p ref="message-raw-width" class="message-width">{{inputContents || "-"}}</p>
		</div>
		<p id="message-byte-length" ref="message-byte-length"
		   :style="{ textShadow: tfStyleTextShadow('var(--tf2-shadow-colour)', -1, 0) }">
			0/127 bytes used
		</p>
		<template v-if="inputSelectRange && !pickerIsOpen">
			<div class="overlay" @mousedown="resetInputSelection"></div>
			<div class="tailed-button">
				<div class="init-grow-wrapper">
					<button @click="pickerIsOpen=true;">colour-ise</button>
					<LeadingTail :width="COLOUR_OPTION_TAIL_WIDTH" :height="COLOUR_OPTION_TAIL_HEIGHT" colour="var(--tf2-shadow-colour)"
					             :style="{ position: `absolute`,
				                           left: `calc(50% - (${COLOUR_OPTION_TAIL_WIDTH} / 2) + ${colourOptionTailOffset}` }" />
				</div>
			</div>
		</template>
		<ColourPicker v-if="pickerIsOpen"
		              @colour-cancelled="pickerIsOpen=false;"
		              @colour-set="(colour:Colour) => {colouriseSubstring(colour);resetInputSelection();pickerIsOpen=false;}" />
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
		user-select: none;
		pointer-events: none;
	}

	#message-input {
		position: relative;
		z-index: 99;
		&>input {
			&:focus-visible, &:focus-within {
				background: hsla(var(--hsl-black) / 10%);
				outline: 3px solid var(--tf2-chat-selection-colour);
			}
		}
		&>* {
			width: v-bind(inputWidth);
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
		min-width: v-bind(minInputWidth);
		opacity: 0;
	}

	.tailed-button {
		position: absolute;
		z-index: 1;
		left: v-bind(selectionPositionCentreX);
		top: v-bind(selectionPositionTopY);
		transform: translate(-50%, -100%);
		transition: left .1s ease;

		& .init-grow-wrapper {
			transform-origin: 50% calc(100% + v-bind(COLOUR_OPTION_TAIL_HEIGHT));
			animation: init-grow .6s ease 1;
		}

		& button {
			width: v-bind(COLOUR_OPTION_SIZE);
			height: v-bind(COLOUR_OPTION_SIZE);
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
