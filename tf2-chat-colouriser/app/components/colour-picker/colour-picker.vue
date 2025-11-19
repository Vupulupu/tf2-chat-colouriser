<script setup lang="ts">
	import {Colour} from "~/utils/colour-picker/colour";

	const oldColour: Colour = Colour.createFromHex("#fcedcd");
	let newColour: Colour = Colour.createFromHex(oldColour.hex);
</script>

<template>
	<div id="colour-picker">
		<div class="picker-header">
			<span>Change Text Colour</span>
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
						     :style="`background-color:${oldColour.hex};`+
						             `color:${oldColour.hsvValue>50?'var(--tf2-shadow-colour)':'var(--tf2-shadow-colour)'}`">
							old
						</div>
						<div class="new col-preview"
						     :style="`background-color:${newColour.hex};`+
						             `color:${newColour.hsvValue>50?'var(--tf2-shadow-colour)':'var(--tf2-shadow-colour)'}`">new</div>
					</div>
				</div>
				<div class="codes">
					<label for="hsl-input-hue">Hue:</label>
					<input id="hsl-input-hue" type="number" min="0" max="360"
					       :value="oldColour.hsvHue.toFixed(2).toString()"
					       :placeholder="oldColour.hsvHue.toFixed(2).toString()" />
					<label for="hsl-input-sat">Sat:</label>
					<input id="hsl-input-sat" type="number" min="0" max="100"
					       :value="oldColour.hsvSaturation.toFixed(2).toString()"
					       :placeholder="oldColour.hsvSaturation.toFixed(2).toString()" />
					<label for="hsl-input-val" class="grid-separator">Val:</label>
					<input id="hsl-input-val" class="grid-separator" type="number" min="0" max="100"
					       :value="oldColour.hsvValue.toFixed(2).toString()"
					       :placeholder="oldColour.hsvValue.toFixed(2).toString()" />

					<label for="rgb-input-red">Red:</label>
					<input id="rgb-input-red" type="number" min="0" max="255"
					       :value="oldColour.rgbRed.toString()"
					       :placeholder="oldColour.rgbRed.toString()" />
					<label for="rgb-input-green">Green:</label>
					<input id="rgb-input-green" type="number" min="0" max="255"
					       :value="oldColour.rgbGreen.toString()"
					       :placeholder="oldColour.rgbGreen.toString()" />
					<label for="rgb-input-blue" class="grid-separator">Blue:</label>
					<input id="rgb-input-blue" class="grid-separator" type="number" min="0" max="255"
					       :value="oldColour.rgbBlue.toString()"
					       :placeholder="oldColour.rgbBlue.toString()" />

					<label for="hex-input">HEX:</label>
					<input id="hex-input" type="text"
					       :value="oldColour.hex"
					       :placeholder="oldColour.hex" />
				</div>
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

	.inputs>.interactive {
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

	.inputs>.codes {
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

	.grid-separator {
		margin-bottom: .75rem;
	}

	input {
		width: 96px;
		padding: .25em;
		border: none;
		border-radius: .25em;
		font-family: "tf2 build", sans-serif;
		font-size: 1em;
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
</style>
