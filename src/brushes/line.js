import { hexToRgb } from '../colors';
// two clicks one brush
// take first click as start, second click as target
export class LineBrush {
    static menuParams = [
		{name: "Color1", defaultVal: "#0000ff"},
		{name: "Color2", defaultVal: "#ffffff"},
		{name: "Size", defaultVal: 5, min: 1, max: 10}
	]

	static displayName = "Line";

	static setParams = {
		Color1: "#0000ff",
		Color2: "#ffffff",
		Size: 5
    }
    
    constructor(params, coord) {
        this.params = params;
        this.color1 = hexToRgb(params.Color1);
        this.color2 = hexToRgb(params.Color2);
        this.start = coord;

        this.f = 0;
    }
    render(processing) {
        processing.pg.beginDraw();
        processing.pg.strokeWeight(this.params.Size);
        processing.pg.stroke(
            processing.lerp(this.color1.r, this.color2.r, this.f),
            processing.lerp(this.color1.g, this.color2.g, this.f),
            processing.lerp(this.color1.b, this.color2.b, this.f)
        );
        processing.pg.line(
            this.start.x,
            this.start.y,
            processing.lerp(this.start.x, this.target.x, this.f), 
            processing.lerp(this.start.y, this.target.y, this.f)
        );
        processing.pg.endDraw();
        this.f += 0.1;
        if (this.f >= 1) { 
            [this.start,this.target] = [this.target,this.start];
            this.f = 0;
        }
    }
}