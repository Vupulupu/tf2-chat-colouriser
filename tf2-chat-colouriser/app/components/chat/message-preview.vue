<script lang="ts">
	import { h } from "vue";
	import type { ColouredRange } from "~/utils/chat/coloured-range";

	export default {
		props: {
			messageContent: { type: String, required: true, default: "" },
			colouredRanges: { type: Array, required: true, default: [] },
			selection: { type: [Object, null], required: true, default: null },
		},
		setup(props) {
			const colouredRanges: ComputedRef<ColouredRange[]> = computed(() => props.colouredRanges as ColouredRange[]);
			const rootMessageNode: Ref<VNode> = useState("root-message-node", () => h("span"));

			let messageParts: (VNode | string)[] = [];
			watchEffect( () => {
				messageParts = [];
				let plainTextStart: number = 0;
				colouredRanges.value.forEach((substr: ColouredRange) => {
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
