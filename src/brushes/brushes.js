/*
brushes require reading from a canvas and then drawing onto the canopy lights
*/

 // For click events, map canopy strips and leds to Canvas 2d cartesian


class RingBrush {
	constructor(brushSize) {	
		this.brushSize = brushSize;
	}
	click(processing,coord) {
		console.log('ring');
		processing.fill(0,255,0);
		processing.ellipse(coord.x,coord.y,100,100);
	}
	render() {

	}
}

class RadialBrush {
	constructor(brushSize) {
		this.brushSize = brushSize;
	}
	click(processing,coord) {
		console.log('RADIAL BRUSH');
	}
	render() {

	}
}

export { RingBrush, RadialBrush };
