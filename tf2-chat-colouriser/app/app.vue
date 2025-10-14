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
		font-family: "verdana", "sans-serif";
		font-size: var(--main-font-size);
	}

	body {
		height: 100dvh;
		display: flow-root;
		margin: 0;
		background-image: url("/mannworks-bk.png");
		background-position: center;
		background-size: cover;
	}

	p, h1, h2, h3, h4, h5, h6 {
		margin: 0;
	}
</style>
