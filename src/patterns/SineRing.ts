
import { RGB, Color } from '../colors';
import { pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import Memoizer from "./canvas/memoizer";
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';


interface SineRingProps {
    color: Color,
    width: number,
    frequency: number,
    amplitude: number,
    radius: number,
    velocity: number,
    rotate: number,
    opacity: number
}

@pattern()
export class SineRing extends BasePattern {
    static displayName = 'Sine Ring';
    static propTypes = {
        color: new PatternPropTypes.Color(),
        width: new PatternPropTypes.Range(1, 10),
        frequency: new PatternPropTypes.Range(1, 16),
        amplitude: new PatternPropTypes.Range(0, 30),
        radius: new PatternPropTypes.Range(5, 30),
        velocity: new PatternPropTypes.Range(0, 10),
        rotate: new PatternPropTypes.Range(-10, 10),
        opacity: new PatternPropTypes.Range(0, 100)
    };

    static defaultProps () : SineRingProps {
        return {
            color: RGB.random(),
            width: 2,
            frequency: 6,
            amplitude: 10,
            radius: 10,
            velocity: 1,
            rotate: 0,
            opacity: 100
        };
    }

    angleStep = 0.01;
    amp = 0;
    dir = 1;
    r = 1;
    iteration = 0;
    memoizer = new Memoizer();

    progress () {
        super.progress();
        this.amp += this.props.velocity * this.dir;
        if (this.amp < 0) {
            this.dir = 1;
        }

        if (this.amp > this.props.amplitude) {
            this.dir = -1;
        }
        this.iteration++;
    }

    render(canopy) {
        const radius = this.props.radius + 20;
        
        const color = this.props.color.withAlpha(this.props.opacity / 100);
        const memoizedMap = this.memoizer.createMap(200, canopy);

        let angle = 0;
        while (angle <= Math.PI * 2) { 
            angle += this.angleStep;
            const x = Math.floor((radius + (Math.sin(angle * this.props.frequency) * this.amp)) * Math.cos(angle));
            const y = Math.floor((radius + (Math.sin(angle * this.props.frequency) * this.amp)) * Math.sin(angle));
            const co = memoizedMap.mapCoords(x + 100, y + 100);
            let s = co.strip + (this.props.rotate * this.iteration) % NUM_STRIPS;
            if (s < 0) { s += NUM_STRIPS; }
            else if (s >= NUM_STRIPS) { s %= NUM_STRIPS; }
            for (let l = 0; l < this.props.width; l++) {
                const led = l + co.led;
                if (led >= 0 && led < NUM_LEDS_PER_STRIP) {
                    canopy.strips[s].updateColor(led, color);
                }
            }
        }
    }
}