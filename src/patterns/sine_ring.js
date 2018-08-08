import { PCanvas } from '.';

/**
 * Applies a sine wave to a concentric circle, given frequency and amplitude of the wave.
 */
export class SineRing {
    static menuParams = [
        {name: "Color", defaultVal: {r: 0, g: 0, b: 255}}, // color of the sine circle
        {name: "Weight", defaultVal: 2, min: 1, max: 10}, // stroke weight of the line
        {name: "Frequency", defaultVal: 6, min: 1, max: 16}, // how many waves
        {name: "Amplitude", defaultVal: 10, min: 0, max: 30}, // how big the waves
        {name: "Radius", defaultVal: 10, min: 5, max: 30}, // radius of concentric circle
        {name: "Velocity", defaultVal: 1, min: 0, max: 10}, // rate of change of wave motion
        {name: "Rotate", defaultVal: 0, min: -10, max: 10}, // rate of change of rotation
        {name: "Brightness", defaultVal: 100, min: 0, max: 100} // brightness/opacity of pattern
    ]
    static displayName = "Sine Ring"; // name displayed on menu

    constructor(params) {
        this.params = params;
        this.canvas = new PCanvas();

        this.angleStep = 0.01;
        this.amp = 0;
        this.dir = 1;
        this.r = 1;
    }

    progress () {
        const { processing } = this.canvas;
        const radius = this.params.Radius + 20;
        let angle = 0;
    
        processing.pg.beginDraw();
        processing.pg.background(0); // wipe canvas to draw next frame in this animation
        processing.pg.pushMatrix(); // bind any transformations to this context
        processing.pg.translate(PCanvas.dimension / 2,PCanvas.dimension / 2); // set context to middle of canvas
        processing.pg.rotate(processing.radians(this.r * this.params.Rotate)); // apply rotations (if this.params.Rotate != 0)
        processing.pg.strokeWeight(this.params.Weight);
        // use PCanvas.color() to set color with this.params.Brightness; this will retain RGBA alpha information for transparency
        const color = PCanvas.color(this.params.Color.r,this.params.Color.g,this.params.Color.b,this.params.Brightness / 100 * 255);
        processing.pg.stroke(color); // set stroke color
        
        while (angle <= Math.PI * 2) { 
            // calculate start point of line segment
            let x = (radius + (Math.sin(angle * this.params.Frequency) * this.amp)) * Math.cos(angle);
            let y = (radius + (Math.sin(angle * this.params.Frequency) * this.amp)) * Math.sin(angle);
            angle += this.angleStep;
            // calculate end point of line segment
            let dx = (radius + (Math.sin(angle * this.params.Frequency) * this.amp)) * Math.cos(angle);
            let dy = (radius + (Math.sin(angle * this.params.Frequency) * this.amp)) * Math.sin(angle);
            // draw line segment
            processing.pg.line(x,y,dx,dy);
        }
        processing.pg.popMatrix(); // remove any transformations applied
        processing.pg.endDraw();

        // update this.amp
        this.amp += this.params.Velocity * this.dir;
        if (this.amp < 0) { this.dir = 1; }
        if (this.amp > this.params.Amplitude) this.dir = -1;
        this.r++;
    }

    render(canopy) {
        // this.canvas.render will handle copying the processing.pg image over to the canopy
        this.canvas.render(canopy);
    }
}
