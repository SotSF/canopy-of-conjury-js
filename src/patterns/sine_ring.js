import { PCanvas } from '.';
import { hexStringToRgb } from '../colors';

export class SineRing {
    static menuParams = [
        {name: "Color", defaultVal: "#0000ff"},
        {name: "Weight", defaultVal: 2, min: 1, max: 10},
        {name: "Frequency", defaultVal: 6, min: 1, max: 16},
        {name: "Amplitude", defaultVal: 10, min: 0, max: 30},
        {name: "Radius", defaultVal: 10, min: 5, max: 60},
        {name: "Velocity", defaultVal: 1, min: 0, max: 10},
    ]
    static displayName = "Sine Ring";

    constructor(params) {
        this.params = params;
        this.params.Brightness = 100;
        this.canvas = new PCanvas();
        this.angleStep = 0.01;

        this.amp = params.Amplitude;
        this.dir = 1;
    }
    update() {
        const { processing } = this.canvas;
        const center = processing.width/2;
        const radius = this.params.Radius + 20;
        let angle = 0;
        
        const color = hexStringToRgb(this.params.Color);
        processing.pg.beginDraw();
        processing.pg.background(0);
        processing.pg.strokeWeight(this.params.Weight);
        processing.pg.stroke(color.r,color.g,color.b,this.params.Brightness / 100 * 255);
        
        while (angle <= Math.PI * 2) { 
            let x = center + (radius + (Math.sin(angle * this.params.Frequency) * this.amp)) * Math.cos(angle);
            let y = center + (radius + (Math.sin(angle * this.params.Frequency) * this.amp)) * Math.sin(angle);
            angle += this.angleStep;
            let dx = center + (radius + (Math.sin(angle * this.params.Frequency) * this.amp)) * Math.cos(angle);
            let dy = center + (radius + (Math.sin(angle * this.params.Frequency) * this.amp)) * Math.sin(angle);
            processing.pg.line(x,y,dx,dy);
        }
        processing.pg.endDraw();
        this.amp += this.params.Velocity * this.dir;
        if (this.amp <= 0) { this.dir = 1; }
        if (this.amp > this.params.Amplitude) this.dir = -1;
        
    }

    render(canopy) {
        this.canvas.render(canopy);
    }
}