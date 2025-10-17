<script setup lang="ts">
	import type {ShallowRef} from "vue";

	const INIT_WIDTH_TRANSITION_STYLE: string = "width .75s ease," +
	                                            "min-width .75s ease," +
	                                            "outline .75s ease";

	let messageLabel: ShallowRef<HTMLLabelElement | null> = useTemplateRef("message-label");
	let sayText: ShallowRef<HTMLElement | null> = useTemplateRef("say-text");
	let messageInput: ShallowRef<HTMLInputElement | null> = useTemplateRef("message-input");
	let messageWidth: ShallowRef<HTMLElement | null> = useTemplateRef("message-width");
	let minInputWidth: Ref<String, String> = useState("min-input-width", () => "0");
	let sayTextWidth: Ref<String, String> = useState("say-text-width", () => "0");
	let inputWidthTransitionStyle: Ref<string, string> = useState("input-width-transition", () => INIT_WIDTH_TRANSITION_STYLE);

	onMounted(() => {
		if (messageLabel?.value && sayText?.value && messageInput?.value && messageWidth?.value) {
			minInputWidth.value = (messageLabel?.value?.offsetWidth - sayText?.value?.offsetWidth) + "px";
			sayTextWidth.value = sayText?.value?.offsetWidth + "px";
			setTimeout(() => {
				inputWidthTransitionStyle.value = ""
			}, 750);
		}
	});

	function resizeInput() {
		const INPUT_WIDTH_PADDING: number = 50;
		if (messageWidth?.value && messageInput?.value) {
			messageWidth.value.innerHTML = messageInput.value.value.replace(/\s/g, "&nbsp;");
			messageInput.value.style.width = (messageWidth.value.offsetWidth + INPUT_WIDTH_PADDING) + "px";
		}
	}
</script>

<template>
	<div id="editor">
		<label for="message-input" ref="message-label" class="message-label">Chat Message</label>
		<div class="chat-container">
			<span ref="say-text" class="say-text">Say :</span>
			<input id="message-input" ref="message-input" type="text" value="" @input="resizeInput(editorComponents)" autofocus />
		</div>
		<p id="message-byte-length" ref="message-byte-length">0/127 bytes used</p>
		<p ref="message-width" class="message-width">-</p>
	</div>
</template>

<style scoped>
	#editor {
		--text-shadow-colour: hsla(var(--tf2-hsl-chat-colour) / 75%);

		width: fit-content;
		display: inline-grid;
		align-self: center;
	}

	#message-byte-length, .message-label {
		font-family: "tf2 secondary", "serif";
		color: hsl(0 0 15%);
	}

	.message-label {
		color: var(--tf2-shadow-colour);
		text-align: left;
		text-shadow: var(--text-shadow-colour) 0 1px 1px, var(--text-shadow-colour) 1px 2px 1px, var(--text-shadow-colour) 2px 3px 1px;
	}

	#message-byte-length {
		color: var(--tf2-chat-colour);
		font-size: calc(var(--main-font-size) * .75);
		text-align: right;
		font-weight: bold;
		text-shadow: var(--tf2-shadow-colour) -1px 0 1px,
		             var(--tf2-shadow-colour) 0 1px 1px,
		             var(--tf2-shadow-colour) 1px 2px 1px,
		             var(--tf2-shadow-colour) 2px 3px 1px,
		             var(--tf2-shadow-colour) 3px 4px 1px;
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
		min-width: var(--input-width)px;
		width: fit-content;
		position: fixed;
		color: transparent;
		text-shadow: none;
		user-select: none;
	}

	@media only screen and (max-width: 320px) {
		#message-input {
			min-width: 0;
		}
	}
</style>
