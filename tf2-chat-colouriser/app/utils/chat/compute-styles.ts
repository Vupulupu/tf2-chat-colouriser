export function tfStyleTextShadow(colour: string, startingX: number, startingY: number, width: number = 1, length: number = 5): {"text-shadow": string} {
	const DIAG_INCR: number = 1;
	const WIDTH_INCR: number = 1;
	let finalStyle: string = '';

	function appendTextShadow(x:number, y:number): void {
		finalStyle += `${colour} ${x}px ${y}px, `;
	}

	for (let x:number=startingX, y:number=startingY; x<startingX+length; x+=DIAG_INCR, y+=DIAG_INCR)
		appendTextShadow(x, y);

	if (width > 1) {
		for (let x:number=startingX+WIDTH_INCR; x<startingX+width; x+=WIDTH_INCR)
			appendTextShadow(x, startingY);

		for (let x:number=startingX+width, y:number=startingY+1; x<startingX+width+length-1; x+=DIAG_INCR, y+=DIAG_INCR)
			appendTextShadow(x, y);

		for (let x:number=startingX+length; x<startingX+length+width-1; x+=WIDTH_INCR)
			appendTextShadow(x, startingY+length-1);
	}

	console.log(finalStyle);
	return { 'text-shadow': finalStyle.slice(0, finalStyle.length-2) };
}
