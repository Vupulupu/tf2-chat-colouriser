<script setup lang="ts">
	const props = defineProps({
		width: { type: String, required: true },
		height: { type: String, required: true },
		endOffset: { type: String, default: "0" }
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
	<div class="arrow"></div>
</template>

<style scoped>
	.arrow {
		width: 0;
		height: 0;
		border-left: calc(v-bind(parsedWidth) / 2) solid transparent;
		border-right: calc(v-bind(parsedWidth) / 2) solid transparent;
		border-top: calc(v-bind(parsedHeight)) solid black;
	}
</style>
