<script setup lang="ts">
</script>

<template>
	<section class="container">
		<hgroup class="h1group">
			<h1>TF2 Chat Colouriser</h1>
			<p>
				Chat colouring tool inspired by
				<a href="https://sourcecolors.neocities.org/" target="_blank">Source&nbsp;Text&nbsp;Chat&nbsp;Colorizer</a> and
				<a href="https://skywur.github.io/tf2-gradient-generator/" target="_blank">Gradient&nbsp;Chat&nbsp;Generator</a>
			</p>
		</hgroup>
		<div id="instructions">
			<p>Enter the text you want to colour below</p>
			<p>Select a portion of your text to colour just that part, leaving the rest unchanged !</p>
		</div>
		<ChatEditor />
	</section>
</template>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		justify-content: center;
		text-align: center;
	}

	.h1group>h1 {
		--h1-font-size: 2rem;
		--h1-line-height: 1.25em;

		position: relative;
		font-family: "tf2 build", "sans-serif";
		font-size: var(--h1-font-size);
		line-height: var(--h1-line-height);
		/* gradient parts: gradient top -> gradient bottom, extra padding aligning to next line (line-height) */
		background: repeating-linear-gradient(to bottom,
		                                      var(--tf2-health-gradient-top),
		                                      var(--tf2-health-gradient-bottom) var(--h1-font-size),
		                                      var(--tf2-health-gradient-bottom) var(--h1-line-height));
		background-clip: text;
		color: transparent;
		filter: drop-shadow(2px 2px 5px hsla(var(--hsl-sepia-shadow) / 75%))
		        drop-shadow(4px 4px 10px hsla(var(--hsl-black) / 30%))
		        drop-shadow(6px 6px 15px hsla(var(--hsl-black) / 10%));

		&::selection {
			text-shadow: hsla(var(--tf2-hsl-shadow-colour) / 50%) 1px 1px 2px,
			             hsla(var(--tf2-hsl-shadow-colour) / 25%) 2px 2px 3px;
		}
	}

	.h1group>p {
		width: fit-content;
		margin: 0 auto;
		padding: 3px 6px;
		font-family: 'verdana', 'sans-serif';
		font-size: calc(var(--main-font-size) / 2);
		background: linear-gradient(-2deg, hsla(var(--hsl-black) / 40%), hsla(var(--hsl-sepia-shadow) / 50%));
		border: 1px solid black;
		border-radius: 10px;
	}

	#instructions {
		margin: 0 2dvw;
		padding: .4rem .8rem;
		background: hsla(var(--hsl-black) / .25);
		border: 1px solid hsla(var(--hsl-black) / .5);
		border-radius: 10px;
	}

	@media only screen and (max-device-width: 350px) {
		.h1group>h1 {
			--h1-font-size: 1.5rem;
		}
	}
</style>
