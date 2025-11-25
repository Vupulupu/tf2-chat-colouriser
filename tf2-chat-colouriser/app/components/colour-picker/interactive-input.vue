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

	const colourPickingIsActive: Ref<boolean> = useState("colour-picker-active", ()=>false);
	const colourPickerEventPositions: UseMouseInElementReturn = useMouseInElement(useTemplateRef("colour-picker"));
	const colPickerSelector: TemplateRef<HTMLElement> = useTemplateRef("colour-selection");
	const colPickerSelectorTransform: Ref<string> = useState("colour-picker-selector-transform", ()=>"translate(0, 0)");

	const hueSelectionIsActive = useState("hue-picker-active", ()=>false);
	const hueSliderEventPositions: UseMouseInElementReturn = useMouseInElement(useTemplateRef("hue-picker"));
	const hueSelector: TemplateRef<HTMLElement> = useTemplateRef("hue-selection");

	let invertOldPreviewTextColour: boolean = oldColour.hsv.getValue().value<50;
	let invertNewPreviewTextColour: Ref<boolean> = computed(() => newColour.hsv.getValue().value<50);

	watchEffect(async () => {
		if (colPickerSelector.value?.style) {
			colPickerSelectorTransform.value = `translate(` +
				`${newColour.hsv.getValue().value/newColour.hsv.getValue().max*colourPickerEventPositions.elementWidth.value}px, ` +
				`${colourPickerEventPositions.elementHeight.value-(newColour.hsv.getSaturation().value/newColour.hsv.getSaturation().max*colourPickerEventPositions.elementHeight.value)}px)`;
		}
		}
	});

	function preventDefault(e: Event) {
		e.preventDefault();
	}

	function activateColourPicker(e: Event) {
		preventDefault(e);
		colourPickingIsActive.value = true;
		window.addEventListener("mousemove", updateColourFromPicker);
		window.addEventListener("touchmove", updateColourFromPicker);
		window.addEventListener("mouseup", disableColourPicker);
		window.addEventListener("touchend", disableColourPicker);
		window.addEventListener("selectstart", preventDefault);
	}

	function disableColourPicker(e: Event) {
		preventDefault(e);
		colourPickingIsActive.value = false;
		window.removeEventListener("mousemove", updateColourFromPicker);
		window.removeEventListener("touchmove", updateColourFromPicker);
		window.removeEventListener("mouseup", disableColourPicker);
		window.removeEventListener("touchend", disableColourPicker);
		window.removeEventListener("selectstart", preventDefault);
	}

	function activateHueSelector(e: Event) {
		preventDefault(e);
		hueSelectionIsActive.value = true;
		window.addEventListener("mousemove", updateColourFromHue);
		window.addEventListener("touchmove", updateColourFromHue);
		window.addEventListener("mouseup", disableHueSelector);
		window.addEventListener("touchend", disableHueSelector);
		window.addEventListener("selectstart", preventDefault);
		updateColourFromPicker();
	}

	function disableHueSelector(e: Event) {
		preventDefault(e);
		hueSelectionIsActive.value = false;
		window.removeEventListener("mousemove", updateColourFromHue);
		window.removeEventListener("touchmove", updateColourFromHue);
		window.removeEventListener("mouseup", disableHueSelector);
		window.removeEventListener("touchend", disableHueSelector);
		window.removeEventListener("selectstart", preventDefault);
	}

	function updateColourFromPicker() {
		const valueClampingRange: ValueRange = new ValueRange(newColour.hsv.getValue().min, newColour.hsv.getValue().max);
		const saturationClampingRange: ValueRange = new ValueRange(newColour.hsv.getSaturation().min, newColour.hsv.getSaturation().max);
		const normalisedValueValue: number = colourPickerEventPositions.elementX.value/colourPickerEventPositions.elementWidth.value*valueClampingRange.max;
		const normalisedSaturationValue: number = 100-colourPickerEventPositions.elementY.value/colourPickerEventPositions.elementHeight.value*saturationClampingRange.max;

		if(colourPickingIsActive.value) {
			newColour.hsv.setSaturation(clamp(normalisedSaturationValue, saturationClampingRange.min, saturationClampingRange.max));
			newColour.hsv.setValue(clamp(normalisedValueValue, valueClampingRange.min, valueClampingRange.max));
			newColour.rgb = Colour.hsvToRgb(newColour.hsv);
			newColour.hex = Colour.rgbToHex(newColour.rgb);
		}
		emit("colourChange", newColour);
	}

	function updateColourFromHue() {
		const hueClampingRange: ValueRange = new ValueRange(newColour.hsv.getHue().min, newColour.hsv.getHue().max);
		let normalisedHueValue: number = hueSliderEventPositions.elementX.value/hueSliderEventPositions.elementWidth.value*hueClampingRange.max;
		const hue: number = clamp(normalisedHueValue, hueClampingRange.min, hueClampingRange.max);

		if(hueSelectionIsActive.value) {
			newColour.hsv.setHue(hue);
			newColour.rgb = Colour.hsvToRgb(newColour.hsv);
			newColour.hex = Colour.rgbToHex(newColour.rgb);
		}
		emit("colourChange", newColour);
	}
</script>

<template>
	<div class="interactive">
		<div class="picker-area" ref="colour-picker"
		     @mousedown.left="activateColourPicker" @touchstart="activateColourPicker"
		     @mousemove="updateColourFromPicker" @touchmove="updateColourFromPicker"
		     @mouseup.left="disableColourPicker" @touchend="disableColourPicker">
			<div id="colour-selection" ref="colour-selection" :style="{ transform: colPickerSelectorTransform }"></div>
		</div>
		<div class="hue-slider" ref="hue-picker"
		     @mousedown.left="activateHueSelector" @touchstart="activateHueSelector"
		     @mousemove="updateColourFromHue" @touchmove="updateColourFromHue"
		     @mouseup.left="disableHueSelector" @touchend="disableHueSelector">
			<div id="hue-selection" ref="hue-selection"></div>
		</div>
		<div class="colour-previews">
			<div class="old col-preview" :class="[(invertOldPreviewTextColour ? 'light' : 'dark'),]"
			     :style="{ backgroundColor: oldColour.hex.getCode().value }">
				old
			</div>
			<div class="new col-preview" :class="[(invertNewPreviewTextColour ? 'light' : 'dark'),]"
			     :style="{ backgroundColor: newColour.hex.getCode().value }">
				new
			</div>
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
		&.light {
			color: var(--tf2-chat-colour);
		}
		&.dark {
			color: var(--tf2-shadow-colour);
		}
	}
</style>
