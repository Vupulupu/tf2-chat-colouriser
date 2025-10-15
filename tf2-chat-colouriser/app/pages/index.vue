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

	.h1group {
		&>h1 {
			--h1-font-size: 2rem;
			--h1-line-height: 1.25em;
			position: relative;
			font-family: "tf2 build", "sans-serif";
			font-size: var(--h1-font-size);
			line-height: var(--h1-line-height);
			background: repeating-linear-gradient(to bottom,
			var(--tf2-health-gradient-top),
			var(--tf2-health-gradient-bottom) var(--h1-font-size),
			var(--tf2-health-gradient-bottom) var(--h1-line-height));
			background-clip: text;
			color: transparent;
			filter: drop-shadow(2px 2px 5px hsl(var(--hsl-sepia-shadow) / .75))
			drop-shadow(4px 4px 10px hsl(0 0 0 / .3))
			drop-shadow(6px 6px 15px hsl(0 0 0 / .1));
		}

		&>p {
			width: fit-content;
			margin: 0 auto;
			padding: 3px 6px;
			font-family: 'verdana', 'sans-serif';
			font-size: calc(var(--verdana-font-size) * .75);
			background: linear-gradient(-2deg, hsl(0 0 0 / .3), hsl(0 0 0 / .5));
			border: 1px solid black;
			border-radius: 10px;
		}
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
