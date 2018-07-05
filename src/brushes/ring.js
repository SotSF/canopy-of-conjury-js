export class RingBrush {
	maxRad = 50;
	constructor(brushSize,color1,color2,coord) {	
		this.brushSize = brushSize;
		this.startColor = color1;
		this.targetColor = color2;
		this.color = color1;
		this.x = coord.x;
		this.y = coord.y;
		
		this.r = 1;
		this.f = 0;
	}
	render(processing) {
		processing.noFill();
		processing.stroke(this.color.r, this.color.g, this.color.b);
		processing.strokeWeight(Math.floor(this.brushSize / 2));
		processing.ellipse(this.x,this.y,this.r,this.r);

		this.r += 3;
		if (this.r >= this.maxRad) this.r = 0;
		this.color = {
			r: processing.lerp(this.startColor.r, this.targetColor.r, this.f),
			g: processing.lerp(this.startColor.g, this.targetColor.g, this.f),
			b: processing.lerp(this.startColor.b, this.targetColor.b, this.f)
		}
		this.f += 0.05;
		if (this.f >= 1) {
			this.f = 0;
			[this.startColor, this.targetColor] = [this.targetColor, this.startColor];
		}
	}
}