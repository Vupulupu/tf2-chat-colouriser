export class IndexRange {
	public startIndex: number;
	public endIndex: number;

	public constructor(startIndex: number, endIndex: number) {
		if (startIndex > endIndex) {
			const temp: number = startIndex;
			startIndex = endIndex;
			endIndex = temp;
		}
		this.startIndex = startIndex;
		this.endIndex = endIndex;
	}

	public length(): number {
		return this.endIndex - this.startIndex;
	}

	public subsumes(compareRange: IndexRange): boolean {
		return (this.startIndex <= compareRange.startIndex && this.endIndex >= compareRange.endIndex);
	}

	public includes(compareRange: IndexRange): boolean {
		return (this.startIndex < compareRange.startIndex && this.endIndex > compareRange.endIndex);
	}

	public contains(compareIndex: number): boolean {
		return (this.startIndex < compareIndex && this.endIndex > compareIndex);
	}

	public compare(compareSubstr: IndexRange): number {
		if (this.startIndex === compareSubstr.startIndex) {
			return this.endIndex - compareSubstr.endIndex;
		} else {
			return this.startIndex - compareSubstr.startIndex;
		}
	}
}
