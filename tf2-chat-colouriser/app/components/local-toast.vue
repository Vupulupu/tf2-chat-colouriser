<script setup lang="ts">
	import type { ShallowRef } from "vue";

	const props = defineProps({
		message: { type: String, required: true },
		duration: { type: Number, default: 3000 },
	});
	const emit = defineEmits(["close"]);

	const ANIM_DURATION_MS: string = "500ms";
	const animState: Ref<{opacity: number, transform: string, transition?: string}> = useState("anim-state", () => {
		return {
			opacity: 0,
			transform: "translateY(100%)",
			transition: `opacity ${ANIM_DURATION_MS} ease, transform ${ANIM_DURATION_MS} ease`};
	})
	const durationBar: ShallowRef<HTMLElement|null> = useTemplateRef("duration-bar");
	const durationPercentProgress: Ref<string> = useState("duration-percent-progress", () => "100%");
	const durationMs: string = `${props.duration}ms`;
	const closeTimeoutId: Ref<number> = useState("close-timeout-id", () => 0);

	onMounted(() => {
		animState.value = {...animState.value, opacity: 1, transform: "translateY(0)"};
		durationPercentProgress.value = "0";
		closeTimeoutId.value = closeTimeout();
	});

	function closeTimeout() {
		return setTimeout(() => closeToast(), props.duration);
	}

	function delayDurationBar() {
		if (durationBar.value) {
			durationBar.value.style.transition = `all ${ANIM_DURATION_MS} ease`;
			durationPercentProgress.value = "100%";
			durationBar.value.style.opacity = "50%";
		}

		clearTimeout(closeTimeoutId.value);
	}

	function resumeDurationBar() {
		if (durationBar.value) {
			durationBar.value.style.transition = "";
			durationPercentProgress.value = "0";
			durationBar.value.style.opacity = "";
			durationBar.value.style.width = "";
		}

		closeTimeoutId.value = closeTimeout();
	}

	function closeToast() {
		animState.value = {...animState.value, opacity: 0, transform: "translateY(100%)"};
		setTimeout(() => {
			emit("close");
			durationPercentProgress.value = "100%";
		}, parseInt(ANIM_DURATION_MS));
	}
</script>

<template>
	<div class="toast-container" @mouseover="delayDurationBar();" @mouseleave="resumeDurationBar();">
		<div class="toast" ref="toast" :style="animState">
			<p class="message">
				{{props.message}}
			</p>
			<div class="duration-bar" ref="duration-bar" />
		</div>
	</div>
</template>

<style scoped>

	.toast-container {
		position: fixed;
		left: 50%;
		bottom: calc(8% + 1em);
		transform: translateX(-50%);
	}

	.toast-container>.toast {
		background-color: var(--tf2-init-menu-head-colour);
		border-radius: .2em;
		overflow: hidden;
		transform-origin: bottom center;
	}

	.message {
		padding: calc(.2em + .2em) .5em .2em .5em;
		font-family: "tf2 secondary", "sans-serif";
		font-size: 1em;
		user-select: none;
	}

	.duration-bar {
		width: v-bind(durationPercentProgress);
		height: .25em;
		background-color: hsl(var(--hsl-black) / 50%);
		transition: width v-bind(durationMs) linear,
			opacity v-bind(ANIM_DURATION_MS) ease;
	}
</style>
