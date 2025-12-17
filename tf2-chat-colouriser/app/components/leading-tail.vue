<script setup lang="ts">
	const props = defineProps({
		width: { type: String, required: true },
		height: { type: String, required: true },
		endOffset: { type: String, default: "0" },
		colour: { type: String, default: "black" },
	});

	const parsedWidth: String = addUnitIfNonzeroNumeric(props.width);
	const parsedHeight: String = addUnitIfNonzeroNumeric(props.height);

	function addUnitIfNonzeroNumeric(str: string): string {
		if (isNaN(Number(str)) || Number(str)===0) {
			return str;
		} else {
			return str+"px";
		}
	}
</script>

<template>
	<div class="arrow" :style="{
		borderLeft: `calc(${parsedWidth} / 2) solid transparent`,
		borderRight: `calc(${parsedWidth} / 2) solid transparent`,
		borderTop: `${parsedHeight} solid ${colour}`,
	}" />
</template>

<style scoped>
	.arrow {
		width: 0;
		height: 0;
	}
</style>
