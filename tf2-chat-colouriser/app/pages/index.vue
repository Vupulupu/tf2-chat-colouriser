<script setup lang="ts">
	import type { ShallowRef } from "vue";

	const RESET_COLOUR_CTRL: string = ""; // 0x01 - reset to default colour
	const SET_COLOUR_CTRL: string = "";   // 0x07 - initiates and marks start of opaque hex code
	const SET_ALPHA_CTRL: string = "\b";   // 0x08 - marks start of alpha hex code
	const OPAQUE_STARTING_BUFFER: string = SET_COLOUR_CTRL + "hihi<3" + SET_COLOUR_CTRL;
	const ALPHA_STARTING_BUFFER: string = SET_COLOUR_CTRL + "hihi<3" + SET_ALPHA_CTRL;

	const INIT_WIDTH_TRANSITION_STYLE: string = "width .75s ease," +
	                                            "min-width .75s ease," +
	                                            "outline .75s ease";

	let messageInput: ShallowRef<HTMLInputElement | null> = useTemplateRef("message-input");
	let messageWidthSpan: ShallowRef<HTMLElement | null> = useTemplateRef("message-width");
	let messageLabel: ShallowRef<HTMLLabelElement | null> = useTemplateRef("message-label");
	let sayText: ShallowRef<HTMLElement | null> = useTemplateRef("say-text");
	let minInputWidth: Ref<String, String> = useState("min-input-width", () => "0");
	let sayTextWidth: Ref<String, String> = useState("say-text-width", () => "0");
	let inputWidthTransitionStyle: Ref<string, string> = useState("input-width-transition", () => INIT_WIDTH_TRANSITION_STYLE);
	const inputWidthPadding: number = 50;

	onMounted(() => {
		if (messageLabel?.value && sayText?.value) {
			minInputWidth.value = (messageLabel.value.offsetWidth -sayText.value.offsetWidth) + "px";
			sayTextWidth.value = sayText.value.offsetWidth + "px";
			setTimeout(() => { inputWidthTransitionStyle.value = "" }, 750);
		}
	});

	function resizeInput() {
		if (messageWidthSpan?.value && messageInput?.value && messageInput?.value && messageWidthSpan?.value) {
			messageWidthSpan.value.innerHTML = messageInput.value.value.replace(/\s/g, "&nbsp;");
			messageInput.value.style.width = (messageWidthSpan.value.offsetWidth + inputWidthPadding) + "px";
		}
	}
</script>

<template>
	<section class="container" @resize="resizeInput">
		<hgroup class="h1group">
			<h1>TF2 Chat Colouriser</h1>
			<p>
				Chat colouring tool inspired by
				<a href="https://sourcecolors.neocities.org/" target="_blank">Source&nbsp;Text&nbsp;Chat&nbsp;Colorizer</a> and
				<a href="https://skywur.github.io/tf2-gradient-generator/" target="_blank">Gradient&nbsp;Chat&nbsp;Generator</a>
			</p>
		</hgroup>
		<div id="editor">
			<label for="message-input" ref="message-label" class="message-label">Chat Message</label>
				<div class="chat-container">
					<span ref="say-text" class="say-text">Say :</span>
					<input id="message-input" ref="message-input" type="text" value="" @input="resizeInput()" autofocus />
				</div>
			<p id="message-byte-length" ref="message-byte-length">0/127 bytes used</p>
		</div>
	</section>
	<p ref="message-width" class="message-width">-</p>
</template>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		justify-content: center;
		text-align: center;
	}

	.h1group {
		&>h1 {
			--h1-font-size: 2rem;
			--h1-line-height: 1.25em;
			position: relative;
			font-family: "tf2 build", "sans-serif";
			font-size: var(--h1-font-size);
			line-height: var(--h1-line-height);
			/* gradient parts: gradient top -> gradient bottom, then extra padding to align with the next line (===line-height */
			background: repeating-linear-gradient(to bottom,
			                                      var(--tf2-health-gradient-top),
			                                      var(--tf2-health-gradient-bottom) var(--h1-font-size),
			                                      var(--tf2-health-gradient-bottom) var(--h1-line-height));
			background-clip: text;
			color: transparent;
			filter: drop-shadow(2px 2px 5px hsla(var(--hsl-sepia-shadow) / 75%))
			        drop-shadow(4px 4px 10px hsla(var(--hsl-black) / 30%))
			        drop-shadow(6px 6px 15px hsla(var(--hsl-black) / 10%));
		}

		&>p {
			width: fit-content;
			margin: 0 auto;
			padding: 3px 6px;
			font-family: 'verdana', 'sans-serif';
			font-size: calc(var(--main-font-size) / 2);
			background: linear-gradient(-2deg, hsla(var(--hsl-black) / 40%), hsla(var(--hsl-sepia-shadow) / 50%));
			border: 1px solid black;
			border-radius: 10px;
		}
	}

	#editor {
		width: fit-content;
		display: inline-grid;
		align-self: center;
		text-shadow: hsla(var(--tf2-hsl-chat-colour) / 50%) 1px 1px 4px;
	}

	#message-byte-length, .message-label {
		font-family: "tf2 secondary", "serif";
		color: hsl(0 0 15%);
	}

	.message-label {
		//display: inline-grid;
		text-align: left;
	}

	#message-byte-length {
		font-size: calc(var(--main-font-size) * .75);
		text-align: right;
	}

	#message-input, .chat-container,  .message-width {
		box-sizing: border-box;
		display: inline-block;
		font-family: "verdana", "sans-serif";
		font-weight: bold;
		font-size: var(--verdana-font-size);
	}

	#message-input, .say-text {
		padding: 5px 10px calc(5px + .1em) 10px;
		color: var(--tf2-chat-colour);
		text-shadow: hsla(var(--hsl-black) / 50%) 2px 2px 1px;
	}

	#message-input, .message-width {
		max-width: calc(95dvw - v-bind(sayTextWidth));
	}

	#message-input {
		min-width: var(--input-width);
		width: var(--input-width);
		margin: 0 auto;
		padding: 5px 10px calc(5px + .1em) 10px;
		text-align: center;
		background: none;
		border: none;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		transition: v-bind(inputWidthTransitionStyle);

		&:focus-visible, &:focus-within {
			background: hsla(var(--hsl-black) / 10%);
			outline: 3px solid var(--tf2-chat-selection-colour);
		}
	}

	.chat-container, .message-width {
		--input-width: v-bind(minInputWidth);

		box-sizing: border-box;
		justify-self: center;
	}

	.chat-container, .say-text {
		--container-border-style: 2px solid hsla(var(--hsl-white) / 50%);
	}

	.chat-container {
		margin: 5px 0;
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
		min-width: calc(var(--input-width) - v-bind(inputWidthPadding))px;
		width: fit-content;
		position: fixed;
		color: transparent;
		user-select: none;
	}
</style>
