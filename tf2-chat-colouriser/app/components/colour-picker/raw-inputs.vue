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

	const OLD_COLOUR: Colour.Colour = props.oldColour as Colour.Colour;
	const newColour: Ref<Colour.Colour> = useState("new-colour", () => props.newColour as Colour.Colour);

	interface ValueSetter {
		setValue: (_: any)=>void,
		context: Object,
	}

	let colourFieldModels: ComputedRef<{oldField:ColourField, newField:ColourField, valueSetter:ValueSetter}[][]> = computed(() => [
		[
			{
				oldField: OLD_COLOUR.hsv.getHue(), newField: newColour.value.hsv.getHue(),
				valueSetter: {setValue: newColour.value.hsv.setHue, context: newColour.value.hsv},
			},
			{
				oldField: OLD_COLOUR.hsv.getSaturation(), newField: newColour.value.hsv.getSaturation(),
				valueSetter: {setValue: newColour.value.hsv.setSaturation, context: newColour.value.hsv},
			},
			{
				oldField: OLD_COLOUR.hsv.getValue(), newField: newColour.value.hsv.getValue(),
				valueSetter: {setValue: newColour.value.hsv.setValue, context: newColour.value.hsv},
			},
		],
		[
			{
				oldField: OLD_COLOUR.rgb.getRed(), newField: newColour.value.rgb.getRed(),
				valueSetter: {setValue: newColour.value.rgb.setRed, context: newColour.value.rgb},
			},
			{
				oldField: OLD_COLOUR.rgb.getGreen(), newField: newColour.value.rgb.getGreen(),
				valueSetter: {setValue: newColour.value.rgb.setGreen, context: newColour.value.rgb},
			},
			{
				oldField: OLD_COLOUR.rgb.getBlue(), newField: newColour.value.rgb.getBlue(),
				valueSetter: {setValue: newColour.value.rgb.setBlue, context: newColour.value.rgb},
			},
		],
	]);

	function updateField(valueSetter: ValueSetter, newVal: string): void {
		valueSetter.setValue.call(valueSetter.context, parseFloat(newVal));

		if (valueSetter.context instanceof HsvColourModel) {
			newColour.value.rgb = Colour.hsvToRgb(newColour.value.hsv);
			newColour.value.hex = Colour.rgbToHex(newColour.value.rgb);
		} else if (valueSetter.context instanceof RgbColourModel) {
			newColour.value.hsv = Colour.rgbToHsv(newColour.value.rgb);
			newColour.value.hex = Colour.rgbToHex(newColour.value.rgb);
		}

		emit("colourChange", newColour);
	}

	function updateCode(valueSetter: ValueSetter, newVal: string): void {
		valueSetter.setValue.call(valueSetter.context, newVal);
		newColour.value.rgb = Colour.hexToRgb(newColour.value.hex);
		newColour.value.hsv = Colour.rgbToHsv(newColour.value.rgb);

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
