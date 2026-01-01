import type { TemplateRef, ShallowRef } from "vue";

export class EditorElements {
	private _nullElements:string[] = [];
	private _messageLabel: ShallowRef<HTMLLabelElement>;
	private _sayLabel: ShallowRef<HTMLElement>;
	private _messageInput: ShallowRef<HTMLInputElement>;

	constructor(messageLabel: TemplateRef<HTMLLabelElement>,
	            sayLabel: TemplateRef<HTMLElement>,
	            messageInput: TemplateRef<HTMLInputElement>) {
		if (!messageLabel) { this._nullElements.push("messageLabel"); }
		if (!sayLabel) { this._nullElements.push("sayText"); }
		if (!messageInput) { this._nullElements.push("messageInput"); }
		if (this._nullElements.length>0) { this.throwNullError(); }

		this._messageLabel = (messageLabel as ShallowRef<HTMLLabelElement>);
		this._sayLabel = (sayLabel as ShallowRef<HTMLElement>);
		this._messageInput = (messageInput as ShallowRef<HTMLInputElement>);
	}

	get messageLabel(): HTMLLabelElement {
		return this._messageLabel.value;
	}

	get sayLabel(): HTMLElement {
		return this._sayLabel.value;
	}

	get messageInput(): HTMLInputElement {
		return this._messageInput.value;
	}

	private throwNullError():void {
		let errorMessage:string = `Parameter${this._nullElements.length>1?'s':''}`;
		this._nullElements.forEach((element:string): void => { errorMessage.concat(` ${element},`); });
		throw new Error(errorMessage.slice(0, errorMessage.length-2) +
		(this._nullElements.length>1)? "are": "is" +
			" null. Ensure all element references are non-null before instantiation.");
	}
}
