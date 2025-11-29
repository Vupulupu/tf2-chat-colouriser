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
</style>
