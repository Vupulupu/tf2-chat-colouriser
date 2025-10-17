import { EditorComponents } from "~/utils/chat/editor-components";

const INPUT_WIDTH_PADDING: number = 25;

export function autoResizeInput(components: EditorComponents): void {
	components.messageWidthSpan().innerHTML = components.messageInput().value.replace(/\s/g, "&nbsp;");
	components.messageInput().style.width = (components.messageWidthSpan().offsetWidth + INPUT_WIDTH_PADDING) + "px";
}
