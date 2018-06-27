/*
brushes require reading from a canvas and then drawing onto the canopy lights
*/

class RingBrush {
	constructor(brushSize) {	
		this.brushSize = brushSize;
	}
	click() {
		console.log('RING BRUSH');
	}
	render() {

	}
}

class RadialBrush {
	constructor(brushSize) {
		this.brushSize = brushSize;
	}
	click() {
		console.log('RADIAL BRUSH');
	}
	render() {

	}
}

export { RingBrush, RadialBrush };
