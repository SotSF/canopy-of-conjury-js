
import * as _ from 'lodash';
import { NUM_STRIPS } from '../canopy';
import { RGB, Color } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface RadarProps {
    color: Color
    velocity: number
    opacity: MaybeOscillator<number>
    tailLength: MaybeOscillator<number>
    clockwise: boolean
}

@pattern()
export class Radar extends BasePattern {
    static displayName = 'Radar';
    static propTypes = {
        color: new PatternPropTypes.Color(),
        velocity: new PatternPropTypes.Range(1, 10),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation(),
        tailLength: new PatternPropTypes.Range(0, 30).enableOscillation(),
        clockwise: new PatternPropTypes.Boolean()
    };

    static defaultProps () : RadarProps {
        return {
            color: RGB.random(),
            velocity: 1,
            opacity: 1,
            tailLength: 0,
            clockwise: true
        };
    }

    head = 0;

    progress () {
        const directionalMultiplier = this.props.clockwise ? -1 : 1;
        this.head += this.props.velocity * directionalMultiplier;
        if (this.head > NUM_STRIPS - 1) this.head = 0;
        if (this.head < 0) this.head = NUM_STRIPS - 1;
    }

    render (canopy) {
        const numStrips = canopy.strips.length;
        const head = this.head % numStrips;
        const opacity = this.values.opacity;
        const tailLength = this.values.tailLength;

        for (let i = 0; i < tailLength + 1; i++) {
            const b = opacity - (0.05 * i);
            const color = this.props.color.withAlpha(b < 0 ? 0 : b);

            let s = head + (this.props.clockwise ? i : -i);
            if (s > numStrips - 1) s %= numStrips;
            if (s < 0) s += numStrips;

            canopy.strips[s].updateColors(color);
        }
    }

    serializeExtra () {
        return {
            head: this.head
        };
    }

    deserializeExtra (object) {
        this.head = object.head;
    }
}
