// derived from https://stackoverflow.com/a/77411041
export default function stringDifferenceLength(before: string, after: string): number {
	let start: number = 0;
	let beforeEnd: number = before.length, afterEnd: number = after.length;
	while ((before[start] === after[start] ) && (++start < Math.min(beforeEnd, afterEnd))) {}
	while ((beforeEnd > start) && (afterEnd > start) && (before[--beforeEnd] === after[--afterEnd])) {}

	return (afterEnd - start) + (start - beforeEnd);
};
