
import { RGB } from '../colors';
import { pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import Memoizer from './memoizer';

@pattern()
export class Heartbeat extends BasePattern {
    static displayName = 'Heartbeat';
    static propTypes = {
        color: new PatternPropTypes.Color,
        brightness: new PatternPropTypes.Range(0,100)
    };

    static defaultProps () {
         return {
            color: RGB.random(),
            brightness: 100
        }; 
    }

    minPulse = 0.05;
    maxPulse = 1.5;
    velocity = 0.03;
    pulse = 0;
    grow = true;
    dimension = 300;
    memoizer = new Memoizer();

    progress () {
        super.progress();
        if (this.grow) {
            this.pulse += this.velocity;
        } else { this.pulse += -(this.velocity * 1.5); }

        if (this.pulse > this.maxPulse) { this.pulse = this.maxPulse; this.grow = false; }
        if (this.pulse < this.minPulse) { this.pulse = this.minPulse; this.grow = true; }
    }

    render (canopy) {
        const memoizedMap = this.memoizer.createMap(this.dimension, canopy);
        const color = this.props.color.withAlpha(this.props.brightness/100);

        let t = 0;
        while ( t < 500 ) {
            const x = (1 + this.pulse) * (16 * Math.sin(t) * Math.sin(t) * Math.sin(t));
            const y = (1 + this.pulse) * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            const x2 = Math.floor(x * 2 + this.dimension / 2);
            const y2 = Math.floor(y * 2 + this.dimension / 2);
            const co = memoizedMap.mapCoords(x2, y2);
            
            for (let l = 0; l <= co.led; l++) {
                canopy.strips[co.strip].updateColor(l, color);
            }
            t++;
        }
    }
}
