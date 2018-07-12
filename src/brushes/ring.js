import { hexToRgb } from '../colors';

export class RingBrush {
	static menuParams = [
		{name: "Color1", defaultVal: "#0000ff"},
		{name: "Color2", defaultVal: "#ffffff"},
		{name: "Size", defaultVal: 5, min: 1, max: 10}
	]

	static displayName = "Ring";

	static setParams = {
		Color1: "#0000ff",
		Color2: "#ffffff",
		Size: 5
	}

	constructor(params,coord) {	
		this.params = params;
		this.startColor = hexToRgb(params.Color1);
		this.targetColor = hexToRgb(params.Color2);

		this.maxRad = params.Size * 10;
		this.x = coord.x;
		this.y = coord.y;
		this.r = 1;
		this.f = 0;
	}
	render(processing) {
		let { startColor, targetColor, maxRad } = this;
		const color = {
			r: processing.lerp(startColor.r, targetColor.r, this.f),
			g: processing.lerp(startColor.g, targetColor.g, this.f),
			b: processing.lerp(startColor.b, targetColor.b, this.f)
		}
		processing.pg.beginDraw();
		processing.pg.noFill();
		processing.pg.stroke(color.r, color.g, color.b);
		processing.pg.strokeWeight(Math.floor(this.params.Size / 2));
		processing.pg.ellipse(this.x,this.y,this.r,this.r);

		this.r += 3;
		if (this.r >= maxRad) this.r = 0;
		
		processing.pg.endDraw();
		this.f += 0.05;
		if (this.f >= 1) {
			this.f = 0;
			[startColor, targetColor] = [targetColor, startColor];
		}
	}
}