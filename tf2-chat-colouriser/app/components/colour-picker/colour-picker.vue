<script setup lang="ts">
</script>

<template>
	<div id="colour-picker">
		<div class="picker-header">
			<span>Change Text Colour</span>
			<button id="close-picker">X</button>
		</div>
		<div class="main-content">
			<div class="interactive">
				<div class="picker-area">
					<div id="colour-selection"></div>
				</div>
				<div class="hue-slider">
					<div id="hue-selection"></div>
				</div>
				<div class="colour-previews">
					<div class="old col-preview">old</div>
					<div class="new col-preview">new</div>
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
		padding: 0 5px 0 5.5px;
		&:hover {
			background-color: var(--tf2-accent-color);
		}
	}

	.main-content {
		padding: var(--popup-padded-spacing);
	}

	.interactive {
		margin-bottom: var(--popup-padded-spacing);
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

	.old.col-preview {
		background-color: var(--tf2-chat-colour);
		color: var(--tf2-shadow-colour);
	}

	.new.col-preview {
		background-color: var(--tf2-chat-selection-colour);
	}

	.finalise-buttons {
		display: flex;
		justify-content: end;
		gap: .5em;
	}

	.finalise-buttons>button {
		flex-grow: 1;
		padding: .25em .5em;
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
		font-size: 1.25em;
	}
</style>