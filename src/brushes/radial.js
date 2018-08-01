import { PCanvas } from '../patterns';

export class RadialBrush {
    static menuParams = [
        {name: "Color1", defaultVal: {r:0,g:0,b:255}},
		{name: "Color2", defaultVal: {r:255, g: 255, b: 255}},
		{name: "Size", defaultVal: 5, min: 1, max: 10}
    ]
    static displayName = "Radial";
    static setParams = {
        Color1: {r:0, g: 0, b: 255},
		Color2: {r:255, g: 255, b: 255},
        Size: 5
    }

    constructor(params, coord) {
        this.params = params;
        this.target = coord;
        this.innerColor = params.Color1;
        this.outerColor = params.Color2;
        this.f = 0;
    }
    render(processing) {
        const { innerColor, outerColor } = this;
        processing.pg.beginDraw();
        processing.pg.strokeWeight(this.params.Size * 2);
        const color = PCanvas.color(processing.lerp(innerColor.r, outerColor.r, this.f), 
            processing.lerp(innerColor.g, outerColor.g, this.f), 
            processing.lerp(innerColor.b, outerColor.b, this.f), 
            this.f * 255);
        processing.pg.stroke(color);
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