
export class RadialBrush {
    constructor(brushsize, color1, color2, coord) {
        this.innerColor = color1;
        this.outerColor = color2;
        this.target = coord;
        this.strokeWeight = brushsize;

        this.f = 0;
    }
    render(processing) {
        processing.strokeWeight(this.strokeWeight * 2);
        processing.stroke(this.outerColor.r, this.outerColor.g, this.outerColor.b, this.f * 255);
        processing.line(processing.width / 2,
            processing.height / 2, 
            processing.lerp(processing.width/2,this.target.x,this.f), 
            processing.lerp(processing.height/2, this.target.y, this.f)
        );
        processing.strokeWeight(this.strokeWeight);
        processing.stroke(this.innerColor.r, this.innerColor.g, this.innerColor.b, this.f * 255);
        processing.line(processing.width / 2,
            processing.height / 2, 
            processing.lerp(processing.width/2,this.target.x,this.f), 
            processing.lerp(processing.height/2, this.target.y, this.f)
        );
        this.f += 0.15;
        if (this.f >= 1) { this.f = 0; }
    }
}