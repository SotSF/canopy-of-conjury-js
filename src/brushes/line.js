
// two clicks one brush
// take first click as start, second click as target
export class LineBrush {
    constructor(brushsize, color1, color2, coord) {
        this.strokeWeight = brushsize;
        this.color1 = color1;
        this.color2 = color2;
        this.start = coord;

        this.f = 0;
    }
    render(processing) {
        processing.pg.beginDraw();
        processing.pg.strokeWeight(this.strokeWeight);
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