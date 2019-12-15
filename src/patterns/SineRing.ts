
import * as _ from 'lodash';
import { RGB, Color } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import Memoizer from './memoizer';


interface SineRingProps {
    color: MaybeOscillator<Color>,
    width: number,
    frequency: number,
    amplitude: number,
    radius: number,
    velocity: number,
    rotate: number,
    opacity: MaybeOscillator<number>
}

@pattern()
export class SineRing extends BasePattern {
    static displayName = 'Sine Ring';
    static propTypes = {
        color: new PatternPropTypes.Color().enableOscillation(),
        width: new PatternPropTypes.Range(1, 10),
        frequency: new PatternPropTypes.Range(1, 16),
        amplitude: new PatternPropTypes.Range(0, 30),
        radius: new PatternPropTypes.Range(5, 30),
        velocity: new PatternPropTypes.Range(0, 5, 0.5),
        rotate: new PatternPropTypes.Range(-10, 10),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation()
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
            opacity: 1
        };
    }

    private readonly angleStep = 0.01;
    private readonly memoizer = new Memoizer();

    private amp = 0;
    private dir = 1;

    progress () {
        super.progress();
        this.amp += this.values.velocity * this.dir;
        if (this.amp < 0) {
            this.dir = 1;
        }

        if (this.amp > this.values.amplitude) {
            this.dir = -1;
        }
    }

    render(canopy) {
        const radius = this.values.radius + 20;
        
        const color = this.values.color.withAlpha(this.values.opacity);
        const memoizedMap = this.memoizer.createMap(200, canopy);

        let angle = 0;
        while (angle <= Math.PI * 2) { 
            angle += this.angleStep;
            const x = Math.floor((radius + (Math.sin(angle * this.values.frequency) * this.amp)) * Math.cos(angle));
            const y = Math.floor((radius + (Math.sin(angle * this.values.frequency) * this.amp)) * Math.sin(angle));
            const co = memoizedMap.mapCoords(x + 100, y + 100);

            let s = util.clampModular(co.strip + (this.values.rotate * this.iteration), 0, canopy.strips.length);
            for (let l = 0; l < this.values.width; l++) {
                // If the coordinate is beyond the canopy, don't do anything
                const led = l + co.led;
                if (!_.inRange(led, 0, canopy.stripLength)) continue;
                canopy.strips[s].updateColor(led, color);
            }
        }
    }

    serializeState () {
        return {
            amp: this.amp,
            dir: this.dir
        };
    }

    deserializeState (object) {
        this.amp = object.amp;
        this.dir = object.dir;
    }
}
