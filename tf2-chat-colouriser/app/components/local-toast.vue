<script setup lang="ts">
	import type { ShallowRef } from "vue";

	const props = defineProps({
		message: { type: String, required: true },
		duration: { type: Number, default: 3000 },
	});
	const emit = defineEmits(["close"]);
	defineExpose({resetDuration});

	const ANIM_DURATION_MS: string = "500ms";
	const durationBar: ShallowRef<HTMLElement|null> = useTemplateRef("duration-bar");
	const isOpen: Ref<boolean> = useState("is-open", () => false);
	const isPaused: Ref<boolean> = useState("is-paused", () => false);
	const isDurationActive: Ref<boolean> = useState("is-duration-active", () => false);
	const durationMs: string = `${props.duration}ms`;
	const tryCloseTimeoutId: Ref<number> = useState("close-timeout-id", () => 0);

	onMounted(() => {
		isOpen.value = true;
		isDurationActive.value = true;

		durationBar.value?.addEventListener("animationend", () => {
			if (isDurationActive.value) {
				tryCloseTimeoutId.value = tryCloseTimeout();
			} else {
				isDurationActive.value = true;
			}
		});
	});

	function tryCloseTimeout() {
		isOpen.value = false;
		return setTimeout(() => {
			emit("close");
			isDurationActive.value = false;
		}, parseInt(ANIM_DURATION_MS));
	}

	function delayDuration() {
		clearTimeout(tryCloseTimeoutId.value);
		isOpen.value = true;
		isDurationActive.value = false;
		isPaused.value = true;
	}

	function resumeDuration() {
		isPaused.value = false;
	}

	function resetDuration() {
		clearTimeout(tryCloseTimeoutId.value);
		isDurationActive.value = false;
		if (!isOpen.value) {
			isOpen.value = true;
			requestAnimationFrame(() => requestAnimationFrame(() => {
				isDurationActive.value = true;
			}));
		}
	}
</script>

<template>
	<div class="toast-container" @mouseover="delayDuration" @mouseleave="resumeDuration">
		<div class="toast" :class="{fade: !isOpen}" ref="toast">
			<p class="message">
				{{props.message}}
			</p>
			<div class="duration-bar" :class="{active: isDurationActive && !isPaused}" ref="duration-bar" />
		</div>
	</div>
</template>

<style scoped>
	@keyframes active-duration {
		from { width: 100%; }
		to { width: 0; }
	}

	@keyframes inactive-duration {
		to { width: 100%; }
	}

	.toast-container {
		position: fixed;
		left: 50%;
		bottom: calc(8% + 1em);
		transform: translateX(-50%);
	}

	.toast-container>.toast {
		opacity: 1;
		background-color: var(--tf2-init-menu-head-colour);
		border-radius: .2em;
		overflow: hidden;
		transform-origin: bottom center;
		transform: translateY(0);
		transition: all v-bind(ANIM_DURATION_MS) ease;

		&.fade {
			opacity: 0;
			transform: translateY(100%);
		}
	}

	.message {
		padding: calc(.2em + .2em) .5em .2em .5em;
		font-family: "tf2 secondary", "sans-serif";
		font-size: 1em;
		user-select: none;
	}

	.duration-bar {
		height: .25em;
		background-color: hsl(var(--hsl-black) / 25%);
		transition: all v-bind(ANIM_DURATION_MS) ease;
		animation: inactive-duration v-bind(ANIM_DURATION_MS) ease forwards 1;

		&.active {
			background-color: hsl(var(--hsl-black) / 50%);
			animation: active-duration v-bind(durationMs) linear forwards 1;
		}
	}
</style>
