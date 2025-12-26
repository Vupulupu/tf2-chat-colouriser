<script lang="ts">
	import { h } from "vue";
	import type { IndexRange } from "~/utils/chat/index-range";
	import type { ColouredRange } from "~/utils/chat/coloured-range";
	import * as Colourise from "~/utils/chat/colourise";

	export default {
		props: {
			messageContent: { type: String, required: true, default: "" },
			colouredRanges: { type: Array, required: true, default: [] },
			selection: { type: [Object, null], required: true, default: null },
		},
		setup(props) {
			const colouredRanges: Ref<ColouredRange[]> = useState("preview-coloured-ranges", () => []);
			const selection: ComputedRef<IndexRange> = computed(() => (props.selection as IndexRange));
			const rootMessageNode: Ref<VNode> = useState("root-message-node", () => h("span"));

			let messageParts: (VNode | string)[] = [];
			watch([props.colouredRanges, selection], () => {
				colouredRanges.value = (props.colouredRanges.slice() as ColouredRange[]).map((range) => range.clone());
				Colourise.adjustColoursAroundRange(props.selection as IndexRange, colouredRanges);

				messageParts = [];
				let plainTextStart: number = 0;
				colouredRanges.value.forEach((range: ColouredRange) => {
					if (selection.value.length() && selection.value.startIndex < range.startIndex) {
						messageParts.push(...addSelectionSection( props.messageContent, plainTextStart, selection.value));
						if (plainTextStart < range.startIndex) plainTextStart = selection.value.endIndex;
					}

					messageParts.push(...addNextRangeSection(props.messageContent, plainTextStart, range, {color: range.colourHex}));
					plainTextStart = range.endIndex;
				});

				if (selection.value.length() && plainTextStart <= selection.value.startIndex) {
					messageParts.push(...addSelectionSection( props.messageContent, plainTextStart, selection.value));
					plainTextStart = selection.value.endIndex;
				}
				if (plainTextStart < props.messageContent.length) {
					messageParts.push(props.messageContent.slice(plainTextStart));
				}

				rootMessageNode.value = h("span", messageParts);
			});

			return () => rootMessageNode.value;
		}
	};

	function addSelectionSection(fullMessage: string, plainTextStart: number, range: IndexRange): (VNode|string)[] {
		return addNextRangeSection(fullMessage, plainTextStart, range,
			{backgroundColor: "var(--tf2-chat-selection-colour)", color: "black", textShadow: "none"});
	}

	function addNextRangeSection(fullMessage: string, plainTextStart: number, range: IndexRange, styles: {}): (VNode|string)[] {
		const finalSections: (VNode|string)[] = [];
		if (plainTextStart < range.startIndex) finalSections.push(fullMessage.slice(plainTextStart, range.startIndex));
		finalSections.push(h("span", {style: styles}, fullMessage.slice(range.startIndex, range.endIndex)));
		return finalSections;
	}
</script>

