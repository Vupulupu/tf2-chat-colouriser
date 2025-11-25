<script setup lang="ts">
	defineProps({
		name: { type: String, required: true },
		id: { type: String, required: true },
		type: {type: String, required: true},
		value: { type: [String, Number], required: true },
		placeholder: { type: String, required: true },
		isGroupSeparator: { type: Boolean, default: false },
		min: Number,
		max: Number,
		step: Number,
	})
	defineEmits(['propertyUpdate']);
</script>

<template>
	<label :for="id" :class="isGroupSeparator?'group-separator':''">
		{{ name.length>5 ? name.slice(0, 3) : name }}:
	</label>
	<input :id="id" :class="isGroupSeparator?'group-separator':''" :type="type" :min="min" :max="max" :step="step"
	       :value="value" :placeholder="placeholder"
	       @input="(event: Event) => $emit('propertyUpdate', (event.target as HTMLInputElement).value)"/>
</template>

<style scoped>
	label, input {
		height: min-content;
	}

	input {
		width: 96px;
		padding: .25em;
		border: none;
		border-radius: .25em;
		font-family: "tf2 build", sans-serif;
		font-size: 1em;
	}

	.group-separator {
		margin-bottom: .75rem;
	}
</style>
