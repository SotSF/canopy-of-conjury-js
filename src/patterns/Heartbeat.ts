
import * as _ from 'lodash';
import { Color, RGB } from '../colors';
import { pattern } from '../types';
import * as util from '../util';
import { BaseProcessingPattern } from './BasePattern';
import { PatternPropTypes } from './utils';
import { PCanvas } from './canvas';

@pattern()
export class Heartbeat extends BaseProcessingPattern {
    static displayName = 'Heartbeat';
    static propTypes = {
        color: new PatternPropTypes.Color,
        minPulse: new PatternPropTypes.Range(0.5, 1.5),
        maxPulse: new PatternPropTypes.Range(1.5, 3),
        velocity: new PatternPropTypes.Range(0.01, 1),
        brightness: new PatternPropTypes.Range(0,100)
    }
    static defaultProps () {
         return {
            color: RGB.random(),
            minPulse: 0.7,
            maxPulse: 2,
            velocity: 0.03,
            brightness: 100
        }; 
    }

    pulse = 0;
    grow = true;

    progress() {
        super.progress();
        const image = this.canvas.processing.pg;
        image.noSmooth();
        image.beginDraw();
        image.background(0);
        const lerp = (this.pulse - this.props.minPulse) / (this.props.maxPulse - this.props.minPulse);
        image.stroke(PCanvas.color(this.props.color.r,this.props.color.g,this.props.color.b,255 * this.props.brightness / 100));
        image.strokeWeight(8);
        let t = 0;
        while ( t < 250 ) {
            const x = Math.floor((1 + this.pulse) * (16 * Math.sin(t) * Math.sin(t) * Math.sin(t)));
            const y = Math.floor((1 + this.pulse) * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)));
            const x2 = Math.floor(x * 2 + PCanvas.dimension / 2);
            const y2 = Math.floor(y * 2 + PCanvas.dimension / 2);
            //image.ellipse(x2,y2,10,10);
            image.line(PCanvas.dimension / 2, PCanvas.dimension/2 - 20, x2, y2);
            t++;
        }
        image.endDraw();
        if (this.grow) {
            this.pulse+= this.props.velocity;
        } else { this.pulse += -(this.props.velocity * 1.5); }

        if (this.pulse > this.props.maxPulse) { this.grow = false; }
        if (this.pulse < this.props.minPulse) { this.grow = true; }


    }

    render(canopy) {
        this.canvas.render(canopy);
    }

}