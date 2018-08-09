
import { RGB, Color } from '../colors';
import { pattern } from '../types';
import { BaseProcessingPattern } from './BasePattern';
import { PCanvas } from './canvas';
import { PatternPropTypes } from './utils';


interface SineRingProps {
    color: Color,
    weight: number,
    frequency: number,
    amplitude: number,
    radius: number,
    velocity: number,
    rotate: number,
    brightness: number
}

/**
 * Applies a sine wave to a concentric circle, given frequency and amplitude of the wave.
 */
@pattern()
export class SineRing extends BaseProcessingPattern {
    static displayName = 'Sine Ring';
    static propTypes = {
        color: new PatternPropTypes.Color(),
        weight: new PatternPropTypes.Range(1, 10),
        frequency: new PatternPropTypes.Range(1, 16),
        amplitude: new PatternPropTypes.Range(0, 30),
        radius: new PatternPropTypes.Range(5, 30),
        velocity: new PatternPropTypes.Range(0, 10),
        rotate: new PatternPropTypes.Range(-10, 10),
        brightness: new PatternPropTypes.Range(0, 100)
    };

    static defaultProps () : SineRingProps {
        return {
            color: new RGB(0, 0, 255),
            weight: 2,
            frequency: 6,
            amplitude: 10,
            radius: 10,
            velocity: 1,
            rotate: 0,
            brightness: 100
        };
    }

    angleStep = 0.01;
    amp = 0;
    dir = 1;
    r = 1;

    progress () {
        const { processing } = this.canvas;
        const radius = this.props.radius + 20;
        let angle = 0;
    
        processing.pg.beginDraw();
        processing.pg.background(0);                                                  // wipe canvas to draw next frame in this animation
        processing.pg.pushMatrix();                                                   // bind any transformations to this context
        processing.pg.translate(PCanvas.dimension / 2,PCanvas.dimension / 2);         // set context to middle of canvas
        processing.pg.rotate(processing.radians(this.iteration * this.props.rotate)); // apply rotations (if this.props.rotate != 0)
        processing.pg.strokeWeight(this.props.weight);

        // use PCanvas.color() to set color with this.props.brightness; this will retain RGBA alpha
        // information for transparency
        const color = PCanvas.color(this.props.color.r,this.props.color.g,this.props.color.b, this.props.brightness / 100 * 255);
        processing.pg.stroke(color);
        
        while (angle <= Math.PI * 2) { 
            // calculate start point of line segment
            let x = (radius + (Math.sin(angle * this.props.frequency) * this.amp)) * Math.cos(angle);
            let y = (radius + (Math.sin(angle * this.props.frequency) * this.amp)) * Math.sin(angle);
            angle += this.angleStep;

            // calculate end point of line segment
            let dx = (radius + (Math.sin(angle * this.props.frequency) * this.amp)) * Math.cos(angle);
            let dy = (radius + (Math.sin(angle * this.props.frequency) * this.amp)) * Math.sin(angle);

            // draw line segment
            processing.pg.line(x,y,dx,dy);
        }

        processing.pg.popMatrix(); // remove any transformations applied
        processing.pg.endDraw();

        this.amp += this.props.velocity * this.dir;
        if (this.amp < 0) {
            this.dir = 1;
        }

        if (this.amp > this.props.amplitude) {
            this.dir = -1;
        }
    }

    render (canopy) {
        // this.canvas.render will handle copying the processing.pg image over to the canopy
        this.canvas.render(canopy);
    }
}
