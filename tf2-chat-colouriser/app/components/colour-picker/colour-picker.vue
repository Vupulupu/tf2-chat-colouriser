<script setup lang="ts">
	import * as Colour from "~/utils/colour-picker/colour";

	const props = defineProps({
		oldColourHex: { type: String, default: "#fcedcd" },
	});

	const emit = defineEmits(["colourSet", "colourCancelled"]);

	const oldColour: Ref<Colour.Colour> = useState("old-colour", () => Colour.createFromHex(props.oldColourHex));
	const newColour: Ref<Colour.Colour> = useState("new-colour", () => Colour.createFromHex(props.oldColourHex));
</script>

<template>
	<div id="colour-picker">
		<div class="picker-header">
			<span>Change Text Colour</span>
			<button id="close-picker" @click="emit('colourCancelled')">X</button>
		</div>
		<div class="main-content">
			<div class="inputs">
				<ColourPickerInteractiveInput :old-colour="oldColour" :new-colour="newColour"
				                              @colour-change="(changedColour: Colour.Colour) => newColour = changedColour" />
				<ColourPickerRawInputs class="raw" :old-colour="oldColour" :new-colour="newColour"
				                       @colour-change="(changedColour: Colour.Colour) => newColour = changedColour" />
			</div>
			<div class="finalise-buttons">
				<button id="cancel" @click="emit('colourCancelled')"><span class="text-icon">✘</span> Cancel</button>
				<button id="confirm" @click="emit('colourSet', newColour)"><span class="text-icon">✔</span> Confirm</button>
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

		transform-origin: bottom right;
		animation: init-grow .6s ease 1;
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
