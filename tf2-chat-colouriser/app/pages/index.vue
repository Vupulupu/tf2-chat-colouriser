<script setup lang="ts">
	let testInput: any = useTemplateRef("test-input");
	let testSpan: any = useTemplateRef("test-span");
	const inputWidthPadding: number = 50;

	function resizeInput() {
		console.log(testSpan.value.innerHTML);
		testSpan.value.innerHTML = testInput.value.value;
		testInput.value.style.width = (testSpan.value.offsetWidth + inputWidthPadding) + "px";
	}
</script>

<template>
	<section class="container">
		<h1>TF2 Chat Colouriser</h1>
		<div>
			<input ref="test-input" class="input" type="text" @input="resizeInput()" />
			<p ref="test-span" class="input-width-ref">-</p>
		</div>
	</section>
</template>

<style scoped>
	.container {
		text-align: center;
	}
	.input, .input-width-ref {
		box-sizing: border-box;
		--input-width: 80px;

		max-width: 95dvw;
		font-family: "verdana", "sans-serif";
		font-weight: bold;
		font-size: var(--verdana-font-size);
	}

	.input {
		min-width: var(--input-width);
		width: var(--input-width);
		text-align: center;
	.input-width-ref {
		min-width: calc(var(--input-width) - v-bind(inputWidthPadding))px;
		width: fit-content;
		position: fixed;
		color: transparent;
	}

</style>
