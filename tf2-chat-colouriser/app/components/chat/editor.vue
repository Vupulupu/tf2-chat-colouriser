<script setup lang="ts">
	import { tfStyleTextShadow } from "~/utils/chat/compute-styles";
	import { EditorElements } from "~/utils/chat/editor-elements";
	import MessagePreview from "~/components/chat/message-preview.vue";
	import type { Colour } from "~/utils/colour-picker/colour";
	import { IndexRange } from "~/utils/chat/index-range";
	import { ColouredRange } from "~/utils/chat/coloured-range";
	import * as Colourise from "~/utils/chat/colourise";
	import stringDifferenceLength from "~/utils/string-difference";

	const editorElements: EditorElements = new EditorElements(useTemplateRef("message-label"),
	                                                                useTemplateRef("say-label"),
	                                                                useTemplateRef("message-input"));

	const minInputWidth: Ref<string> = useState("min-input-width", () => "0");
	const inputWidth: Ref<string> = useState("input-width", () => "0");
	const inputScroll: Ref<number> = useState("input-scroll", () => 0);
	const inputTransition: Ref<string> = useState("input-transition-style", () => "");
	const sayTextWidth: Ref<string> = useState("say-text-width", () => "0");
	const inputContents: Ref<string> = useState("input-contents", () => "");
	const NBSP: string = ' '; // raw &nbsp; char to be use-able with any data binding
	const inputSelect: Ref<IndexRange> = useState("input-selection", () => new IndexRange(0, 0));
	const inputSelectRange: Ref<Range | null> = useState("input-selection-range", () => null);
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
		if (!inputSelectRect.value || !editorElements.messageInput) return "0";
		else {
			const inputCenter: number = editorElements.messageInput.getBoundingClientRect().left+(editorElements.messageInput.offsetWidth/2);
			const offsetFromCentre: number = inputSelectRect.value.left+(inputSelectRect.value.width/2)-inputCenter;
			return `${offsetFromCentre/(editorElements.messageInput.offsetWidth/2) * 10}px`
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

	const inputZIndex: number = 10;
	provide("input-z-index", inputZIndex);

	onMounted(() => {
		const INIT_INPUT_ANIMATION_DURATION: number = 750;
		const INPUT_WIDTH_PADDING: number = 25;
		const INIT_WIDTH: string = (editorElements.messageLabel.offsetWidth - editorElements.sayText.offsetWidth + INPUT_WIDTH_PADDING) + "px";
		sayTextWidth.value = `${editorElements.sayText.offsetWidth}px`;

		inputTransition.value = `width ${INIT_INPUT_ANIMATION_DURATION}ms ease,` +
			`min-width ${INIT_INPUT_ANIMATION_DURATION}ms ease,` +
			`outline ${INIT_INPUT_ANIMATION_DURATION}ms ease`;
		minInputWidth.value = INIT_WIDTH;
		inputWidth.value = INIT_WIDTH;
		setTimeout(() => {
			inputTransition.value = "";
		}, INIT_INPUT_ANIMATION_DURATION);

		editorElements.messageInput.addEventListener("selectionchange", () => {
			const inputEl: HTMLInputElement = editorElements.messageInput;
			if (inputEl.selectionStart!==null && inputEl.selectionEnd!==null) {
				inputSelect.value = new IndexRange(inputEl.selectionStart, inputEl.selectionEnd);
			}
		});
	});

	function updateMirror() {
		const inputEl: HTMLInputElement = editorElements.messageInput;
		Colourise.updateColour(stringDifferenceLength(inputContents.value, inputEl.value), colouredRanges, inputSelect.value);
		inputContents.value = inputEl.value.replace(/\s/g, NBSP);
		updateMirrorScroll();
	}

	function updateMirrorScroll() {
		inputScroll.value = editorElements.messageInput.scrollLeft;
	}

	function resetInputSelection() {
		editorElements.messageInput.selectionStart = 0;
		editorElements.messageInput.selectionEnd = 0;
	}

	function colouriseSubstring(colour: Colour) {
		if (inputSelect.value) {
			const startIndex: number = inputSelect.value.startIndex;
			const endIndex: number = inputSelect.value.endIndex;
			const newColouredRange: ColouredRange = new ColouredRange(colour.hex.getCode().value, startIndex, endIndex);

			Colourise.applyColour(newColouredRange, colouredRanges);
			resetInputSelection();
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
			<span ref="say-label" class="say-label">Say :</span>
			<span id="input-container">
				<MessagePreview class="message-mirror" :style="{zIndex: inputZIndex-1}" :message-content="inputContents"
				                :coloured-ranges="colouredRanges" :selection="inputSelect" :scroll="inputScroll"
				                @resize-width="(newWidth: number) => inputWidth=`${newWidth}px`"
				                @select-range="(newRange: Range) => inputSelectRange=newRange" />
				<input ref="message-input" :style="{zIndex: inputZIndex}" type="text" value=""
				       @scroll="updateMirrorScroll" @input="updateMirror" autofocus />
			</span>
		</div>
		<p id="message-byte-length" ref="message-byte-length"
		   :style="{ textShadow: tfStyleTextShadow('var(--tf2-shadow-colour)', -1, 0) }">
			0/127 bytes used
		</p>
		<template v-if="inputSelectRange && !pickerIsOpen">
			<div class="overlay" :style="{zIndex: inputZIndex-2}" @mousedown="resetInputSelection"></div>
			<div class="tailed-button" :style="{zIndex: inputZIndex-1}">
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
		              @colour-set="(colour:Colour) => {colouriseSubstring(colour);pickerIsOpen=false;}" />
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

	#input-container>*,
	.chat-container {
		box-sizing: border-box;
		font-family: "verdana", "sans-serif";
		font-weight: bold;
		font-size: var(--verdana-font-size);
	}

	#input-container>*,
	.say-label {
		padding: 5px 10px calc(5px + .1em) 10px;
	}

	.message-mirror,
	.say-label {
		text-shadow: hsla(var(--hsl-black) / 50%) 2px 2px 1px;
	}

	.message-mirror {
		position: absolute;
		left: 0;
		user-select: none;
		pointer-events: none;
	}

	#input-container,
	#input-container>* {
		overflow: hidden;
		border: none;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	#input-container {
		position: relative;
		padding: 5px 0;
		&:focus-visible, &:focus-within {
			background: hsla(var(--hsl-black) / 10%);
		}
	}

	#input-container>input {
		position: relative;
		-webkit-text-fill-color: transparent;
		&:focus-visible, &:focus-within {
			outline: 3px solid var(--tf2-chat-selection-colour);
		}
		&::selection {
			color: unset;
			background: unset;
		}
	}

	#input-container>* {
		min-width: v-bind(minInputWidth);
		width: v-bind(inputWidth);
		max-width: calc(95dvw - v-bind(sayTextWidth));
		padding: 5px 10px calc(5px + .1em) 10px;
		color: var(--tf2-chat-colour);
		text-align: center;
		background: none;
		transition: v-bind(inputTransition);
	}

	.chat-container,
	.say-label {
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

	.say-label {
		padding-right: 5px;
		border-right: var(--container-border-style);
		user-select: none;
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
		#input-container {
			min-width: 0;
		}
	}
</style>
