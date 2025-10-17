import type { ShallowRef } from "vue";

export class EditorComponents {
	private null_elements:string[] = [];
	private message_label: ShallowRef<HTMLLabelElement>;
	private say_text: ShallowRef<HTMLElement>;
	private message_input: ShallowRef<HTMLInputElement>;
	private message_width_span: ShallowRef<HTMLElement>;

	constructor(messageLabel: ShallowRef<HTMLLabelElement | null>,
				sayText: ShallowRef<HTMLElement | null>,
				messageInput: ShallowRef<HTMLInputElement | null>,
				messageWidthSpan: ShallowRef<HTMLElement | null>) {
		if (!messageLabel) { this.null_elements.push("messageLabel"); }
		if (!sayText) { this.null_elements.push("sayText"); }
		if (!messageInput) { this.null_elements.push("messageInput"); }
		if (!messageWidthSpan) { this.null_elements.push("messageWidthSpan"); }
		if (this.null_elements.length>0) { this.throwNullError(); }

		this.message_label = (messageLabel as ShallowRef<HTMLLabelElement>);
		this.say_text = (sayText as ShallowRef<HTMLElement>);
		this.message_input = (messageInput as ShallowRef<HTMLInputElement>);
		this.message_width_span = (messageWidthSpan as ShallowRef<HTMLElement>);
	}

	public messageLabel(): HTMLLabelElement {
		return this.message_label?.value;
	}

	public sayText(): HTMLElement {
		return this.say_text?.value;
	}

	public messageInput(): HTMLInputElement {
		return this.message_input?.value;
	}

	public messageWidthSpan(): HTMLElement {
		return this.message_width_span?.value;
	}

	private throwNullError():void {
		let errorMessage:string = `Parameter${this.null_elements.length>1?'s':''}`;
		this.null_elements.forEach((element:string) => { errorMessage.concat(` ${element},`); });
		throw new Error(errorMessage.slice(0, errorMessage.length-2) +
		(this.null_elements.length>1)? "are": "is" +
			" null. Ensure all element references are non-null before instantiation.");
	}
}
