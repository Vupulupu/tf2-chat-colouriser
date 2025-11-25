<script setup lang="ts">
	import { ColourField } from "~/utils/colour-picker/colour-field";
	import * as Colour from "~/utils/colour-picker/colour";
	import { HsvColourModel } from "~/utils/colour-picker/hsv-colour-model";
	import { RgbColourModel } from "~/utils/colour-picker/rgb-colour-model";

	const props = defineProps({
		oldColour: { type: Object, required: true },
		newColour: { type: Object, required: true },
	});
	const emit = defineEmits(["colourChange"]);

	const oldColour = props.oldColour as Colour.Colour;
	const newColour = props.newColour as Colour.Colour;

	interface ValueSetter {
		setValue: (_: any)=>void,
		context: Object,
	}

	let colourFieldModels: { oldField: ColourField, newField: ColourField, valueSetter: ValueSetter }[][];
	watchEffect(() => {
		colourFieldModels = [
			[
				{
					oldField: oldColour.hsv.getHue(), newField: newColour.hsv.getHue(),
					valueSetter: {setValue: newColour.hsv.setHue, context: newColour.hsv},
				},
				{
					oldField: oldColour.hsv.getSaturation(), newField: newColour.hsv.getSaturation(),
					valueSetter: {setValue: newColour.hsv.setSaturation, context: newColour.hsv},
				},
				{
					oldField: oldColour.hsv.getValue(), newField: newColour.hsv.getValue(),
					valueSetter: {setValue: newColour.hsv.setValue, context: newColour.hsv},
				},
			],
			[
				{
					oldField: oldColour.rgb.getRed(), newField: newColour.rgb.getRed(),
					valueSetter: {setValue: newColour.rgb.setRed, context: newColour.rgb},
				},
				{
					oldField: oldColour.rgb.getGreen(), newField: newColour.rgb.getGreen(),
					valueSetter: {setValue: newColour.rgb.setGreen, context: newColour.rgb},
				},
				{
					oldField: oldColour.rgb.getBlue(), newField: newColour.rgb.getBlue(),
					valueSetter: {setValue: newColour.rgb.setBlue, context: newColour.rgb},
				},
			],
		];
	})

	function updateField(valueSetter: ValueSetter, newVal: string): void {
		valueSetter.setValue.call(valueSetter.context, parseFloat(newVal));

		if (valueSetter.context instanceof HsvColourModel) {
			newColour.rgb = Colour.hsvToRgb(newColour.hsv);
			newColour.hex = Colour.rgbToHex(newColour.rgb);
		} else if (valueSetter.context instanceof RgbColourModel) {
			newColour.hsv = Colour.rgbToHsv(newColour.rgb);
			newColour.hex = Colour.rgbToHex(newColour.rgb);
		}

		emit("colourChange", newColour);
	}

	function updateCode(valueSetter: ValueSetter, newVal: string): void {
		valueSetter.setValue.call(valueSetter.context, newVal);
		newColour.rgb = Colour.hexToRgb(newColour.hex);
		newColour.hsv = Colour.rgbToHsv(newColour.rgb);

		emit("colourChange", newColour);
	}

	onErrorCaptured((err, instance, info) => {
		//TODO:: style erroneous input on throwing an error
		return false;
	})
</script>

<template>
	<div class="raw">
		<template v-for="(model, modelIndex) in colourFieldModels">
			<template v-for="(field, fieldIndex) in model">
				<ColourPickerRawInputField :name="field.newField.name" :id="`field-${modelIndex}-${field.newField.name}`"
				                           type="number" :min="field.newField.min" :max="field.newField.max"
				                           :step="1/(10**field.newField.fractionalPrecision)"
				                           :is-group-separator="fieldIndex>=model.length-1 && modelIndex<model.length-1"
				                           :value="field.newField.formatter(field.newField.value)"
				                           :placeholder="field.newField.formatter(field.oldField.value).toString()"
				                           @property-update="(val: string) => { updateField(field.valueSetter, val)}" />
			</template>
		</template>
		<ColourPickerRawInputField :name="newColour.hex.getCode().name" :id="`code-hex`"
		                           type="text" :value="newColour.hex.getCode().value"
		                           :placeholder="newColour.hex.getCode().value"
		                           @property-update="(val: string) => {
		                           	updateCode({setValue: newColour.hex.setCode, context: newColour.hex}, val)}" />
	</div>
</template>

<style scoped>
.raw {
	display: grid;
	grid-template-columns: fit-content(3ch) auto;
	grid-template-rows: repeat(7, auto);
	align-items: center;
	color: var(--tf2-shadow-colour);
	font-size: .75em;
	text-align: end;
	&>* {
		height: min-content;
	}
}
</style>
