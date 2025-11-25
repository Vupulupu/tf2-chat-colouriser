<script setup lang="ts">
	import * as Colour from "~/utils/colour-picker/colour";

	const oldColour: Ref<Colour.Colour> = useState("old-colour", () => Colour.createFromHex("#fcedcd"));
	let newColour: Ref<Colour.Colour> = useState("new-colour", () => Colour.createFromHex("#fcedcd"));

	let oldPreviewTextColour: Ref<string> = computed(() => {
		return `${oldColour.value.hsv.getValue().value>50?'var(--tf2-shadow-colour)':'var(--tf2-shadow-colour)'}` });
	let newPreviewTextColour: Ref<string> = computed(() => {
		return `${newColour.value.hsv.getValue().value>50?'var(--tf2-shadow-colour)':'var(--tf2-shadow-colour)'}` });
</script>

<template>
	<div id="colour-picker">
		<div class="picker-header">
			<span>Change Text ConvertColourModels</span>
			<button id="close-picker">X</button>
		</div>
		<div class="main-content">
			<div class="inputs">
				<div class="interactive">
					<div class="picker-area">
						<div id="colour-selection"></div>
					</div>
					<div class="hue-slider">
						<div id="hue-selection"></div>
					</div>
					<div class="colour-previews">
						<div class="old col-preview"
						     :style="`background-color:${oldColour.hex.getCode().value};color:${oldPreviewTextColour}`">
							old
						</div>
						<div class="new col-preview"
						     :style="`background-color:${newColour.hex.getCode().value};color:${newPreviewTextColour}`">
							new
						</div>
					</div>
				</div>
				<ColourPickerRawInputs class="raw" :old-colour="oldColour" :new-colour="newColour"
				                       @colour-change="(changedColour: Colour.Colour) => {newColour = changedColour; console.log(newColour)}" />
			</div>
			<div class="finalise-buttons">
				<button id="cancel"><span class="text-icon">✘</span> Cancel</button>
				<button id="confirm"><span class="text-icon">✔</span> Confirm</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
	#colour-picker {
		--popup-padded-spacing: .5rem;

		position: absolute;
		top: 200px;
		left: 100px;
		border-radius: .5rem;
		overflow: hidden;
		background-color: var(--tf2-chat-colour);
		font-family: "tf2 build", sans-serif;
		font-size: .75rem;
		& * {
			box-sizing: border-box;
		}
	}

	.picker-header {
		width: auto;
		padding: .25em;
		background-color: var(--tf2-init-menu-head-colour);
	}

	#close-picker {
		position: absolute;
		top: .3em;
		right: 10px;
		border: none;
		border-radius: 50%;
		background-color: var(--tf2-chat-colour);
		color: var(--tf2-init-menu-head-colour);
		font-family: inherit;
		font-size: 1em;
		line-height: 1.1em;
		letter-spacing: -1px;
		padding: 0 5px;
		&:hover {
			background-color: var(--tf2-accent-color);
		}
	}

	.main-content {
		padding: var(--popup-padded-spacing);
	}

	.inputs {
		display: flex;
		gap: var(--popup-padded-spacing);
		margin-bottom: var(--popup-padded-spacing);
	}

	.interactive {
		grid-area: interactive;
		display: grid;
		grid-template: "area preview"
		               "slider slider" / 1fr auto;
		gap: var(--popup-padded-spacing);
		&>* {
			box-shadow: var(--tf2-shadow-colour) 0 0 2px, var(--tf2-shadow-colour) 0 0 2px, var(--tf2-shadow-colour) 0 0 2px;
			border-radius: 2px;
		}
	}

	.picker-area {
		grid-area: area;
		width: 256px;
		height: 256px;
		background: linear-gradient(to right, black, transparent), linear-gradient(red, white);
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

	.finalise-buttons {
		display: flex;
		justify-content: end;
		gap: .5em;
	}

	.finalise-buttons>button {
		width: 10em;
		padding: .25em;
		display: flex;
		align-items: center;
		border: none;
		border-radius: .25em;
		background: var(--tf2-shadow-colour);
		color: var(--tf2-chat-colour);
		font-family: inherit;
		line-height: 1.2em;
		font-size: .75em;
		text-align: start;
		&:hover {
			background: var(--tf2-accent-color);
		}
	}

	.text-icon {
		padding: 0 .25em;
		font-size: 1.25em;
	}

	@media only screen and (max-width: 320px) {
		#close-picker {
			padding: 0 3px;
		}
	}

	@media only screen and (min-device-width: 321px) and (max-device-width: 768px) {
		#close-picker {
			padding: 0 4px;
		}
	}
</style>
