<script setup lang="ts">
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style>
	@font-face {
		font-family: "tf2 build";
		src: local("tf2 build"),
		     url("/fonts/tf/tf2build.ttf") format("truetype");
		ascent-override: 100%; /* reset font ascent; regularly importing has a lower boundary for some reason */
	}

	@font-face {
		font-family: "tf2 professor";
		src: local("tf2 professor scaled"),
		url("/fonts/tf/tf2professorscaled.ttf") format("truetype");
	}

	:root {
		--verdana-font-size: 16pt;
		--main-font-size: 24pt;
		font-family: "tf2 professor", "sans-serif";
		font-size: var(--main-font-size);

		--tf2-hsl-shadow-colour: 40 9% 6.5%;
		--tf2-hsl-chat-colour: 41 88.7% 89.6%;
		--tf2-hsl-chat-selection-colour: 38 100% 50%;
		--tf2-health-gradient-top: hsl(39 96.1% 90%);
		--tf2-health-gradient-bottom: hsl(41 17.4% 63.9%);
		--hsl-sepia-shadow: 10 45% 16%;
		color: hsl(var(--tf2-hsl-chat-colour));
	}

	*::selection {
		color: hsl(var(--tf2-hsl-shadow-colour));
		background: hsl(var(--tf2-hsl-chat-selection-colour));
		text-shadow: hsl(var(--tf2-hsl-shadow-colour) / .5) 1px 1px 2px,
		             hsl(var(--tf2-hsl-shadow-colour) / .25) 2px 2px 3px;
	}

	body {
		height: 100dvh;
		display: flow-root;
		margin: 0;
		background-image: linear-gradient(to top, hsl(0 0 0 / .75), transparent 30%), radial-gradient(transparent, hsl(14 42% 13%) 200%), url("/mannworks-bk.png");
		background-position: top center;
		background-size: cover;
	}

	p, h1, h2, h3, h4, h5, h6 {
		margin: 0;
	}

	a {
		color: hsl(var(--tf2-hsl-chat-selection-colour));
		&::selection {
			color: hsl(15 95% 35%);
			text-shadow: none;
			text-decoration: double hsl(15 95% 35%);
		}
	}
</style>
