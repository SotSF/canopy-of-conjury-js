/*
brushes require reading from a canvas and then drawing onto the canopy lights
*/

 // For click events, map canopy strips and leds to Canvas 2d cartesian


class RingBrush {
	constructor(brushSize,color1,color2,coord) {	
		this.brushSize = brushSize;
		this.color1 = color1;
		this.color2 = color2;
		this.x = coord.x;
		this.y = coord.y;

		this.done = false;
		this.r = 1;
	}
	render(processing) {
		processing.noFill();
		processing.stroke(this.color1.r, this.color1.g, this.color1.b);
		processing.strokeWeight(Math.floor(this.brushSize / 2));
		processing.ellipse(this.x,this.y,this.r,this.r);

		this.r += 3;
		this.done = this.r >= 30;
	}
}

class RadialBrush {
	constructor(brushSize) {
		this.brushSize = brushSize;
	}
	render() {

	}
}

export { RingBrush, RadialBrush };
