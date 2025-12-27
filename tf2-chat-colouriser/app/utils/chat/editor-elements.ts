import type { ShallowRef } from "vue";

export class EditorElements {
	private _nullElements:string[] = [];
	private _messageLabel: ShallowRef<HTMLLabelElement>;
	private _sayText: ShallowRef<HTMLElement>;
	private _messageInput: ShallowRef<HTMLInputElement>;

	constructor(messageLabel: ShallowRef<HTMLLabelElement | null>,
	            sayText: ShallowRef<HTMLElement | null>,
	            messageInput: ShallowRef<HTMLInputElement | null>) {
		if (!messageLabel) { this._nullElements.push("messageLabel"); }
		if (!sayText) { this._nullElements.push("sayText"); }
		if (!messageInput) { this._nullElements.push("messageInput"); }
		if (this._nullElements.length>0) { this.throwNullError(); }

		this._messageLabel = (messageLabel as ShallowRef<HTMLLabelElement>);
		this._sayText = (sayText as ShallowRef<HTMLElement>);
		this._messageInput = (messageInput as ShallowRef<HTMLInputElement>);
	}

	get messageLabel(): HTMLLabelElement {
		return this._messageLabel.value;
	}

	get sayText(): HTMLElement {
		return this._sayText.value;
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
