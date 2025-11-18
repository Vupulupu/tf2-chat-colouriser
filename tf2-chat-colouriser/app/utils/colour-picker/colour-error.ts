// https://medium.com/@Nelsonalfonso/understanding-custom-errors-in-typescript-a-complete-guide-f47a1df9354c [:
export class ColourError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ColourError";
		// Set the prototype explicitly to maintain the correct prototype chain
		Object.setPrototypeOf(this, ColourError.prototype);
	}
}
