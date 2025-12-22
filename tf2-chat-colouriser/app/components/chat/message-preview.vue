<script lang="ts">
	import { h } from "vue";
	import type { ColouredSubstring } from "~/utils/chat/coloured-substring";

	export default {
		props: {
			messageContent: { type: String, required: true, default: "" },
			colouredSubstrings: { type: Array, required: true, default: [] },
			selection: { type: [Object, null], required: true, default: null },
		},
		setup(props) {
			const colouredSubstrings: ComputedRef<ColouredSubstring[]> = computed(() => props.colouredSubstrings as ColouredSubstring[]);
			const rootMessageNode: Ref<VNode> = useState("root-message-node", () => h("span"));

			let messageParts: (VNode | string)[] = [];
			watchEffect( () => {
				messageParts = [];
				let plainTextStart: number = 0;
				colouredSubstrings.value.forEach((substr: ColouredSubstring) => {
					if (substr.startIndex > plainTextStart) {
						messageParts.push(props.messageContent.slice(plainTextStart, substr.startIndex));
					}
					messageParts.push(h(
						"span",
						{ style: `color: ${substr.colourHex}` },
						props.messageContent.slice(substr.startIndex, substr.endIndex))
					);

					plainTextStart = substr.endIndex;
				});
				if (plainTextStart < props.messageContent.length) {
					messageParts.push(props.messageContent.slice(plainTextStart));
				}

				rootMessageNode.value = h("span", messageParts);
			});

			return () => rootMessageNode.value;
		}
	};
</script>

<style scoped>

</style>
