<script setup lang="ts">

</script>

<template>
	<main>
		<slot/>
	</main>
	<footer>
		<p>v.0.1.0</p>
		<p>Created by <a href="https://steamcommunity.com/id/Vupulupu/">Vupulupu</a></p>
	</footer>
</template>

<style>
	main {
		margin-top: 50px;
	}

	footer {
		box-sizing: border-box;
		width: 100%;
		padding: 10px;
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		font-family: "jetbrains mono", "sans-serif";
		font-size: calc(var(--main-font-size) / 2);
	}
</style>
