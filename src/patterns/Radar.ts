
import { NUM_STRIPS } from '../canopy';
import { RGB, Color } from '../colors';
import { pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface RadarProps {
    color: Color,
    velocity: number,
    brightness: number,
    tailLength: number,
    clockwise: boolean
}

@pattern()
export class Radar extends BasePattern {
    static displayName = 'Radar';
    static propTypes = {
        color: new PatternPropTypes.Color(),
        velocity: new PatternPropTypes.Range(1, 10),
        brightness: new PatternPropTypes.Range(0, 100),
        tailLength: new PatternPropTypes.Range(0, 30),
        clockwise: new PatternPropTypes.Boolean()
    };

    static defaultProps () : RadarProps {
        return {
            color: RGB.random(),
            velocity: 1,
            brightness: 100,
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

        for (let i = 0; i < this.props.tailLength + 1; i++) {
            const b = this.props.brightness - (5 * i);
            const color = this.props.color.withAlpha(b < 0 ? 0 : b / 100);

            let s = head + (this.props.clockwise ? i : -i);
            if (s > numStrips - 1) s %= numStrips;
            if (s < 0) s += numStrips;

            canopy.strips[s].updateColors(color);
        }
    }
}
