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
	const hueOnlyNewColour: Ref<Colour.Colour> = computed(() => {
		return Colour.createFromHSV(newColour.hsv.getHue().value, newColour.hsv.getSaturation().max, newColour.hsv.getValue().max);
	});

	const colourPickingIsActive: Ref<boolean> = useState("colour-picker-active", ()=>false);
	const colourPickerArea: TemplateRef<HTMLElement> = useTemplateRef("colour-picker");
	const colourPickerEventPositions: UseMouseInElementReturn = useMouseInElement(colourPickerArea);
	const colourSelector: TemplateRef<HTMLElement> = useTemplateRef("colour-selection");
	const colourSelectorTransform: Ref<string> = useState("colour-picker-selector-transform", ()=>"translate(0, 0)");

	const hueSelectionIsActive = useState("hue-picker-active", ()=>false);
	const hueSliderArea: TemplateRef<HTMLElement> = useTemplateRef("hue-picker");
	const hueSliderEventPositions: UseMouseInElementReturn = useMouseInElement(hueSliderArea);
	const hueSelector: TemplateRef<HTMLElement> = useTemplateRef("hue-selection");
	const hueSelectorTransform: Ref<string> = useState("hue-selector-transform", ()=>"translateX(0)");

	const pickerHue: Ref<string> = computed(() => hueOnlyNewColour.value.hex.getCode().value);
	const colourSelectorFill: Ref<string> = computed(() => newColour.hex.getCode().value);
	const hueSelectorFill: Ref<string> = computed(() => hueOnlyNewColour.value.hex.getCode().value);

	const invertOldPreviewTextColour: boolean = oldColour.hsv.getValue().value>50;
	const invertNewPreviewTextColour: Ref<boolean> = computed(() => newColour.hsv.getValue().value>50);

	watch([newColour, colourSelectorTransform, hueSelectorTransform], async () => { await updateSelectorPositions(); });

	// For some reason this needs to be wrapped in a setTimeout, even if it has a 0ms delay.
	// I have no idea how it works under the hood lmao.
	setTimeout(()=>updateSelectorPositions(), 0);


	function preventDefault(e: Event) {
		e.preventDefault();
	}

	async function activateColourPicker(e: Event) {
		preventDefault(e);
		colourPickingIsActive.value = true;
		window.addEventListener("mousemove", updateColourFromPicker);
		window.addEventListener("touchmove", updateColourFromPicker);
		window.addEventListener("mouseup", disableColourPicker);
		window.addEventListener("touchend", disableColourPicker);
		window.addEventListener("selectstart", preventDefault);
		await updateColourFromPicker();
	}

	async function disableColourPicker(e: Event) {
		preventDefault(e);
		colourPickingIsActive.value = false;
		window.removeEventListener("mousemove", updateColourFromPicker);
		window.removeEventListener("touchmove", updateColourFromPicker);
		window.removeEventListener("mouseup", disableColourPicker);
		window.removeEventListener("touchend", disableColourPicker);
		window.removeEventListener("selectstart", preventDefault);
	}

	async function activateHueSelector(e: Event) {
		preventDefault(e);
		hueSelectionIsActive.value = true;
		window.addEventListener("mousemove", updateColourFromHue);
		window.addEventListener("touchmove", updateColourFromHue);
		window.addEventListener("mouseup", disableHueSelector);
		window.addEventListener("touchend", disableHueSelector);
		window.addEventListener("selectstart", preventDefault);
		await updateColourFromHue();
	}

	async function disableHueSelector(e: Event) {
		preventDefault(e);
		hueSelectionIsActive.value = false;
		window.removeEventListener("mousemove", updateColourFromHue);
		window.removeEventListener("touchmove", updateColourFromHue);
		window.removeEventListener("mouseup", disableHueSelector);
		window.removeEventListener("touchend", disableHueSelector);
		window.removeEventListener("selectstart", preventDefault);
	}

	async function updateColourFromPicker() {
		if(colourPickingIsActive.value && colourPickerArea.value) {
			const valueClampingRange: ValueRange = new ValueRange(newColour.hsv.getValue().min, newColour.hsv.getValue().max);
			const saturationClampingRange: ValueRange = new ValueRange(newColour.hsv.getSaturation().min, newColour.hsv.getSaturation().max);
			const normalisedValueValue: number = colourPickerEventPositions.elementX.value/colourPickerArea.value.offsetHeight*valueClampingRange.max;
			const normalisedSaturationValue: number = 100-colourPickerEventPositions.elementY.value/colourPickerArea.value.offsetHeight*saturationClampingRange.max;

			newColour.hsv.setSaturation(clamp(normalisedSaturationValue, saturationClampingRange.min, saturationClampingRange.max));
			newColour.hsv.setValue(clamp(normalisedValueValue, valueClampingRange.min, valueClampingRange.max));
			newColour.rgb = Colour.hsvToRgb(newColour.hsv);
			newColour.hex = Colour.rgbToHex(newColour.rgb);
		}
		emit("colourChange", newColour);
	}

	async function updateColourFromHue() {
		if(hueSelectionIsActive.value && hueSliderArea.value) {
		const hueClampingRange: ValueRange = new ValueRange(newColour.hsv.getHue().min, newColour.hsv.getHue().max);
		const normalisedHueValue: number = hueSliderEventPositions.elementX.value/hueSliderArea.value.offsetWidth*hueClampingRange.max;
		const hue: number = clamp(normalisedHueValue, hueClampingRange.min, hueClampingRange.max);

			newColour.hsv.setHue(hue);
			newColour.rgb = Colour.hsvToRgb(newColour.hsv);
			newColour.hex = Colour.rgbToHex(newColour.rgb);
		}
		emit("colourChange", newColour);
	}

	async function updateSelectorPositions() {
		if (colourSelector.value?.style && colourPickerArea.value) {
			colourSelectorTransform.value = `translate(` +
				`${newColour.hsv.getValue().value/newColour.hsv.getValue().max*colourPickerArea.value.offsetWidth}px, ` +
				`${colourPickerArea.value.offsetHeight-(newColour.hsv.getSaturation().value/newColour.hsv.getSaturation().max*colourPickerArea.value.offsetHeight)}px)`;
		}
		if (hueSelector.value?.style && hueSliderArea.value) {
			hueSelectorTransform.value = `translateX(` +
				`${newColour.hsv.getHue().value/newColour.hsv.getHue().max*hueSliderArea.value.offsetWidth}px)`;
		}
	}
</script>

<template>
	<div class="interactive">
		<div class="picker-area" ref="colour-picker"
		     @mousedown.left="activateColourPicker" @touchstart="activateColourPicker"
		     @mousemove="updateColourFromPicker" @touchmove="updateColourFromPicker"
		     @mouseup.left="disableColourPicker" @touchend="disableColourPicker">
			<div id="colour-selection" ref="colour-selection" :style="{ transform: colourSelectorTransform }"></div>
		</div>
		<div class="hue-slider" ref="hue-picker"
		     @mousedown.left="activateHueSelector" @touchstart="activateHueSelector"
		     @mousemove="updateColourFromHue" @touchmove="updateColourFromHue"
		     @mouseup.left="disableHueSelector" @touchend="disableHueSelector">
			<div id="hue-selection" ref="hue-selection" :style="{ transform: hueSelectorTransform }"></div>
		</div>
		<div class="colour-previews">
			<div class="old col-preview" :class="{dark: invertOldPreviewTextColour}"
			     :style="{ backgroundColor: oldColour.hex.getCode().value }">
				old
			</div>
			<div class="new col-preview" :class="{dark: invertNewPreviewTextColour}"
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
		--picker-hue: v-bind(pickerHue);
		position: relative;
		grid-area: area;
		width: 256px;
		height: 256px;
		background: linear-gradient(to right, black, transparent), linear-gradient(var(--picker-hue), white);
	}

	.hue-slider {
		position: relative;
		grid-area: slider;
		width: 360px;
		height: 32px;
		background: linear-gradient(to right, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00);
	}

	#colour-selection, #hue-selection {
		--picker-size: 8px;
		position: absolute;
		top: calc(var(--picker-size) / -2);
		left: calc(var(--picker-size) / -2);
		width: var(--picker-size);
		height: var(--picker-size);
		border: 1px solid white;
		box-shadow: var(--interactive-menu-shadow);
		transition: transform .1s ease-out;
	}

	#colour-selection {
		border-radius: 50%;
		background-color: v-bind(colourSelectorFill);
	}

	#hue-selection {
		height: calc(100% + var(--picker-size));
		border-radius: calc(var(--picker-size) / 4);
		background-color: v-bind(hueSelectorFill);
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
		&.dark {
			color: var(--tf2-shadow-colour);
		}
	}
</style>
