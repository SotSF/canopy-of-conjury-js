
import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { Color, RGB } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import Oscillator from "./utils/oscillator";


interface ICircle {
    color: Color
    pos: number
    width: number
}

interface ConcentricCirclesProps {
    color: Color,
    width: MaybeOscillator<number>,
    frequency: number
}

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
@pattern()
export class ConcentricCircles extends BasePattern {
    static displayName = 'Concentric Circles';

    static propTypes = {
        color: new PatternPropTypes.Color(),
        width: new PatternPropTypes.Range(1, 10).enableOscillation(),
        frequency: new PatternPropTypes.Range(100, 1, -1)
    };

    static defaultProps () : ConcentricCirclesProps {
        return {
            color: RGB.random(),
            width: 1,
            frequency: 20
        };
    }

    circles: ICircle[] = [];

    progress () {
        super.progress();

        if (this.iteration % this.props.frequency === 0) {
            this.circles.push({
                pos: 0,
                color: this.props.color,
                width: this.getOscillatorValue('width')
            });
        }

        // go through every position in beatList, and light up the corresponding LED in all strips
        this.circles.forEach((circle) => {
            // increment the position of each beat for the next go-around
            circle.pos++;

            // remove if the position is too big
            const circleEdge = circle.pos - circle.width;
            if (circleEdge >= NUM_LEDS_PER_STRIP) {
                this.circles = _.without(this.circles, circle);
            }
        });
    }

    render (canopy) {
        const stripLength = canopy.stripLength;

        this.circles.forEach((circle) => {
            canopy.strips.forEach((strip) => {
                _.range(circle.width).forEach((i) => {
                    const position = circle.pos - i;
                    if (position < 0 || position >= stripLength) return;

                    strip.updateColor(position, circle.color.toRgb())
                });
            });
        });
    }

    serialize () {
        return {
            circles: this.circles.map((circle) => ({
                ...circle,
                color: circle.color.serialize(),
            }))
        };
    }

    deserialize (obj) {
        const { props, circles } = obj;
        this.circles = circles.map((circle) => ({
            ...circle,
            color: RGB.fromObject(circle.color)
        }));

        this.updateProps({
            color: RGB.fromObject(props.color),
            width: Oscillator.fromObject(props.width) || props.width,
            frequency: props.frequency
        });
    }
}
