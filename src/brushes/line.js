import { hexStringToRgb } from '../colors';
// two clicks one brush
// take first click as start, second click as target
export class LineBrush {
    static menuParams = [
		{name: "Color1", defaultVal: {r:0,g:0,b:255}},
		{name: "Color2", defaultVal: {r:255, g: 255, b: 255}},
        {name: "Size", defaultVal: 5, min: 1, max: 10},
        {name: "RemainSolid", defaultVal: true}
	]

	static displayName = "Line (Click 2x)";

	static setParams = {
		Color1: {r:0, g: 0, b: 255},
		Color2: {r:255, g: 255, b: 255},
		Size: 5
    }
    
    constructor(params, coord) {
        this.params = params;
        this.start = coord;

        this.f = 0.05;
    }
    render(processing) {
        processing.pg.beginDraw();
        processing.pg.strokeWeight(this.params.Size);
        processing.pg.stroke(
            processing.lerp(this.params.Color1.r, this.params.Color2.r, this.f),
            processing.lerp(this.params.Color1.g, this.params.Color2.g, this.f),
            processing.lerp(this.params.Color1.b, this.params.Color2.b, this.f)
        );
       if (this.params.RemainSolid) {
            processing.pg.line(
                this.start.x,
                this.start.y,
                this.target.x,
                this.target.y
            );
       }
       else {
            processing.pg.line(
                this.start.x,
                this.start.y,
                processing.lerp(this.start.x, this.target.x, this.f), 
                processing.lerp(this.start.y, this.target.y, this.f)
            );
       }
       
        processing.pg.endDraw();
        this.f += 0.05;
        if (this.f >= 1) { 
            [this.start,this.target] = [this.target,this.start];
            this.f = 0.05;
        }
    }
}