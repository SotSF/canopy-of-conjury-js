
// two clicks one brush
// take first click as start, second click as end
export class LineBrush {
    constructor(brushsize, color1, color2, coord) {
        this.strokeWeight = brushsize;
        this.color1 = color1;
        this.color2 = color2;
        this.start = coord;

        this.f = 0;
    }
    render(processing) {
        processing.strokeWeight(this.strokeWeight);
        processing.stroke(
            processing.lerp(this.color1.r, this.color2.r, this.f),
            processing.lerp(this.color1.g, this.color2.g, this.f),
            processing.lerp(this.color1.b, this.color2.b, this.f)
        );
        processing.line(
            this.start.x,
            this.start.y,
            processing.map(this.f,0,1,this.start.x,this.target.x), 
            processing.map(this.f,0,1,this.start.y,this.target.y)
        );
        this.f += 0.1;
        if (this.f >= 1) { 
            [this.start,this.target] = [this.target,this.start];
            this.f = 0;
        }
    }
}