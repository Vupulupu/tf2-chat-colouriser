<script setup lang="ts">

</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style>
	body {
		height: 100dvh;
		display: flow-root;
		margin: 0;
		background-color: var(--tf2-shadow-colour);
		background-image: linear-gradient(to top, var(--tf2-shadow-colour), transparent 30%),
		radial-gradient(transparent, hsl(14 42% 13%) 200%),
		url("/mannworks-bk.png");
		background-position: top center;
		background-size: cover;
		background-repeat: no-repeat;
	}

	@keyframes init-grow {
		0% {
			transform: scale(0, 0);
		}
		60% {
			transform: scale(102%, 102%);
		}
		100% {
			transform: scale(100%, 100%);
		}
	}
</style>
