<script setup lang="ts">
	import * as Colour from "~/utils/colour-picker/colour";
	import { clamp } from "@vueuse/core";
	import type { UseMouseInElementReturn } from "@vueuse/core";
	import type { TemplateRef } from "vue";

	const props = defineProps({
		oldColour: { type: Object, required: true },
		newColour: { type: Object, required: true },
	});
	const emit = defineEmits(["colourChange"]);

	const oldColour: Colour.Colour = props.oldColour as Colour.Colour;
	const newColour: Colour.Colour = props.newColour as Colour.Colour;

	const colourPickerIsActive: Ref<boolean> = useState("colour-picker-active", ()=>false);
	const colPickerMousePositions: UseMouseInElementReturn = useMouseInElement(useTemplateRef("colour-picker"));
	const colPickerTracker: TemplateRef<HTMLElement> = useTemplateRef("colour-selection");
	const colPickerTrackerTransformStyle: Ref<string> = useState("colour-picker-tracker-transform", ()=>"translate(0, 0)");

	watchEffect(async () => {
		if (colPickerTracker.value?.style) {
			colPickerTrackerTransformStyle.value = `translate(` +
				`${newColour.hsv.getValue().value/100*colPickerMousePositions.elementWidth.value}px, ` +
				`${colPickerMousePositions.elementHeight.value-(newColour.hsv.getSaturation().value/100*colPickerMousePositions.elementHeight.value)}px)`;
		}
	});

	function preventDefaultWrapper(e: Event) {
		e.preventDefault();
	}

	function activateColourPicker() {
		colourPickerIsActive.value = true;
		window.addEventListener("mousemove", updatePickerColour);
		window.addEventListener("mouseup", disableColourPicker);
		window.addEventListener("selectstart", preventDefaultWrapper);
	}

	function disableColourPicker() {
		colourPickerIsActive.value = false;
		window.removeEventListener("mousemove", updatePickerColour);
		window.removeEventListener("mouseup", disableColourPicker);
		window.removeEventListener("selectstart", preventDefaultWrapper);
	}

	function updatePickerColour() {
		const value: number = clamp(colPickerMousePositions.elementX.value/colPickerMousePositions.elementWidth.value*100, 0, 100);
		const saturation: number = clamp(100-colPickerMousePositions.elementY.value/colPickerMousePositions.elementHeight.value*100, 0, 100);
		if(colourPickerIsActive.value) {
			newColour.hsv.setSaturation(saturation);
			newColour.hsv.setValue(value);
			newColour.rgb = Colour.hsvToRgb(newColour.hsv);
			newColour.hex = Colour.rgbToHex(newColour.rgb);
		}

		emit("colourChange", newColour);
	}
</script>

<template>
	<div class="interactive">
		<div class="picker-area" ref="colour-picker"
		     @mousedown.left="activateColourPicker(); updatePickerColour();"
		     @mousemove="updatePickerColour();" @mouseup.left="disableColourPicker();">
			<div id="colour-selection" ref="colour-selection" :style="{ transform: colPickerTrackerTransformStyle }"></div>
		</div>
		<div class="hue-slider" ref="hue-picker">
			<div id="hue-selection" ref="hue-selection"></div>
		</div>
		<div class="colour-previews">
			<div class="old col-preview">old</div>
			<div class="new col-preview" :style="{ backgroundColor: newColour.hex.getCode().value }">new</div>
		</div>
	</div>
</template>

<style scoped>
	.interactive {
		--interactive-menu-shadow: var(--tf2-shadow-colour) 0 0 2px, var(--tf2-shadow-colour) 0 0 4px;
		grid-area: interactive;
		display: grid;
		grid-template: "area preview"
			               "slider slider" / 1fr auto;
		gap: var(--popup-padded-spacing);
		&>* {
			box-shadow: var(--interactive-menu-shadow);
			border-radius: 2px;
		}
	}

	.picker-area {
		position: relative;
		grid-area: area;
		width: 256px;
		height: 256px;
		background: linear-gradient(to right, black, transparent), linear-gradient(red, white);
	}

	#colour-selection {
		position: absolute;
		top: -4px;
		left: -4px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: 1px solid white;
		box-shadow: var(--interactive-menu-shadow);
	}

	.hue-slider {
		grid-area: slider;
		width: 360px;
		height: 32px;
		background: linear-gradient(to right, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00);
	}

	.colour-previews {
		grid-area: preview;
		height: 75%;
		display: grid;
		margin: 8px 8px 0 0;
		user-select: none;
	}

	.col-preview {
		width: 48px;
		padding-left: 3px;
		font-family: "verdana", sans-serif;
		font-size: .5rem;
		text-align: start;
	}
</style>
