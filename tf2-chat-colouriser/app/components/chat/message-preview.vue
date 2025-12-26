<script lang="ts">
	import { h, type ShallowRef } from "vue";
	import type { IndexRange } from "~/utils/chat/index-range";
	import type { ColouredRange } from "~/utils/chat/coloured-range";
	import * as Colourise from "~/utils/chat/colourise";

	export default {
		props: {
			messageContent: { type: String, required: true, default: "" },
			colouredRanges: { type: Array, required: true, default: [] },
			selection: { type: [Object, null], required: true, default: null },
			scroll: { type: Number, required: false, default: 0 },
		},
		emits: ["resizeWidth"],
		setup(props, {emit}) {
			const colouredRanges: Ref<ColouredRange[]> = useState("preview-coloured-ranges", () => []);
			const selection: ComputedRef<IndexRange> = computed(() => (props.selection as IndexRange));
			const scroll: ComputedRef<number> = computed(() => props.scroll);
			const messagePreview: ShallowRef<HTMLSpanElement|null> = useTemplateRef("root-span");
			let messageParts: (VNode | string)[] = [];

			onUpdated(() => {
				if (messagePreview.value) {
					messagePreview.value.style.width = "fit-content";
					emit("resizeWidth", messagePreview.value.scrollWidth);
					messagePreview.value.style.width = "";

					messagePreview.value.scrollLeft = scroll.value;
				}
			})

			watch([props.colouredRanges, selection], () => {
				colouredRanges.value = (props.colouredRanges.slice() as ColouredRange[]).map((range) => range.clone());
				messageParts = buildSpanTree();
			});

			return () => h( "span", {ref: "root-span"}, messageParts);



			function buildSpanTree(): (VNode|string)[] {
				const messageParts: (VNode|string)[] = [];
				const renderSelection: boolean = !!selection.value.length();
				let selectionRendered: boolean = false
				let plainTextStart: number = 0;

				if (renderSelection) Colourise.adjustColoursAroundRange(props.selection as IndexRange, colouredRanges);
				colouredRanges.value.forEach((range: ColouredRange) => {
					if (renderSelection && !selectionRendered && selection.value.startIndex < range.startIndex) {
						messageParts.push(...addSelectionSection( props.messageContent, plainTextStart, selection.value));
						plainTextStart = selection.value.endIndex;
						selectionRendered = true;
					}

					messageParts.push(...addNextRangeSection(props.messageContent, plainTextStart, range, {color: range.colourHex}));
					plainTextStart = range.endIndex;
				});

				if (renderSelection && plainTextStart <= selection.value.startIndex) {
					messageParts.push(...addSelectionSection( props.messageContent, plainTextStart, selection.value));
					plainTextStart = selection.value.endIndex;
				}
				if (plainTextStart < props.messageContent.length) {
					messageParts.push(props.messageContent.slice(plainTextStart));
				}

				return messageParts;
			}
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

