<script setup lang="ts">
	let messageInput: any = useTemplateRef("message-input");
	let messageWidthSpan: any = useTemplateRef("message-width");
	let messageLabel: any = useTemplateRef("message-label");
	let minInputWidth: any = useState("min-input-width", () => "0");
	let inputWidthTransition: any = useState("input-width-transition", () => "width .5s ease, min-width .75s ease");
	const inputWidthPadding: number = 50;


	onMounted(() => {
		minInputWidth.value = messageLabel.value.offsetWidth + "px";
		setTimeout(() => { inputWidthTransition.value = "" }, 750);
	});

	function resizeInput() {
		messageWidthSpan.value.innerHTML = messageInput.value.value;
		messageInput.value.style.width = (messageWidthSpan.value.offsetWidth + inputWidthPadding) + "px";
	}
</script>

<template>
		<h1>TF2 Chat Colouriser</h1>
		<div>
			<input ref="test-input" class="input" type="text" @input="resizeInput()" />
			<p ref="test-span" class="input-width-ref">-</p>
	<section class="container" @resize="resizeInput">
		<div id="editor">
			<label for="message-input" ref="message-label" class="message-label">
				Chat Message
				<br />
				<input id="message-input" ref="message-input" class="message-input" type="text" @input="resizeInput()" />
			</label>
			<p ref="message-width" class="message-width">-</p>
		</div>
	</section>
</template>

<style scoped>
	.container {
		text-align: center;
	}

	.message-label {
		display: inline-grid;
		text-align: left;
	}

	.message-input, .message-width {
		--input-width: v-bind(minInputWidth);

		max-width: 95dvw;
		box-sizing: border-box;
		justify-self: center;
		font-family: "verdana", "sans-serif";
		font-weight: bold;
		font-size: var(--verdana-font-size);
	}

	.message-input {
		min-width: var(--input-width);
		width: var(--input-width);
		margin: 0 auto;
		padding: 10px 20px;
		text-align: center;
		color: hsl(var(--tf2-hsl-chat-colour));
		background: hsl(0 0 0 / .5);
		border: 1px solid hsl(0 0 0 /.75);
		border-radius: 10px;
		transition: v-bind(inputWidthTransition);

		&:focus-visible, &:focus-within {
			outline: 2px solid hsl(var(--tf2-hsl-chat-selection-colour));
		}
	}

	.message-width {
		min-width: calc(var(--input-width) - v-bind(inputWidthPadding))px;
		width: fit-content;
		position: fixed;
		color: transparent;
	}
</style>
