import { hexStringToRgb } from '../colors';

export class RadialBrush {
    static menuParams = [
        {name: "Color1", defaultVal: "#0000ff"},
		{name: "Color2", defaultVal: "#ffffff"},
		{name: "Size", defaultVal: 5, min: 1, max: 10}
    ]
    static displayName = "Radial";
    static setParams = {
        Color1: "#0000ff",
        Color2: "#ffffff",
        Size: 5
    }

    constructor(params, coord) {
        this.params = params;
        this.target = coord;
        this.innerColor = hexStringToRgb(params.Color1);
        this.outerColor = hexStringToRgb(params.Color2);
        this.f = 0;
    }
    render(processing) {
        const { innerColor, outerColor } = this;
        processing.pg.beginDraw();
        processing.pg.strokeWeight(this.params.Size * 2);
        processing.pg.stroke(outerColor.r, outerColor.g, outerColor.b, this.f * 255);
        processing.pg.line(processing.width / 2,
            processing.height / 2, 
            processing.lerp(processing.width/2,this.target.x,this.f), 
            processing.lerp(processing.height/2, this.target.y, this.f)
        );
        processing.pg.strokeWeight(this.params.Size);
        processing.pg.stroke(innerColor.r, innerColor.g, innerColor.b, this.f * 255);
        processing.pg.line(processing.width / 2,
            processing.height / 2, 
            processing.lerp(processing.width/2,this.target.x,this.f), 
            processing.lerp(processing.height/2, this.target.y, this.f)
        );
        processing.pg.endDraw();
        this.f += 0.15;
        if (this.f >= 1) { this.f = 0; }
    }
}