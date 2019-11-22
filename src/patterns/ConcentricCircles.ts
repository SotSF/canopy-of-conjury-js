
import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { Color, RGB } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface ICircle {
    color: Color
    pos: number
    width: number
    trail: number
}

interface ConcentricCirclesProps {
    color: MaybeOscillator<Color>
    width: MaybeOscillator<number>
    frequency: number
    trail: number
}

/** Emits pulse rings from center */
@pattern()
export class ConcentricCircles extends BasePattern {
    static displayName = 'Concentric Circles';

    static propTypes = {
        color: new PatternPropTypes.Color().enableOscillation(),
        width: new PatternPropTypes.Range(1, 10).enableOscillation(),
        frequency: new PatternPropTypes.Range(100, 1, -1),
        trail: new PatternPropTypes.Range(0, 10)
    };

    static defaultProps () : ConcentricCirclesProps {
        return {
            color: RGB.random(),
            width: 1,
            frequency: 20,
            trail: 0
        };
    }

    circles: ICircle[] = [];

    progress () {
        super.progress();

        if (this.iteration % this.values.frequency === 0) {
            this.circles.push({
                pos: 0,
                color: this.values.color,
                width: this.values.width,
                trail: this.values.trail
            });
        }

        this.circles.forEach((circle) => {
            // Increment the position of each circle
            circle.pos++;

            // Remove if the circle has already reached the edge of the canopy
            const circleEdge = circle.pos - (circle.width + circle.trail);
            if (circleEdge >= NUM_LEDS_PER_STRIP) {
                this.circles = _.without(this.circles, circle);
            }
        });
    }

    render (canopy) {
        const stripLength = canopy.stripLength;

        this.circles.forEach((circle) => {
            canopy.strips.forEach((strip) => {
                _.range(circle.width + circle.trail).forEach((i) => {
                    const position = circle.pos - i;
                    if (position < 0 || position >= stripLength) return;

                    if (i >= circle.width) {
                        // Draw the trail
                        const trailPos = (i - circle.width + 1) / circle.trail;
                        const color = circle.color.withAlpha(util.lerp(1, 0, trailPos));
                        strip.updateColor(position, color);
                    } else {
                        // Draw the circle
                        strip.updateColor(position, circle.color.toRgb())
                    }
                });
            });
        });
    }

    serializeExtra () {
        return {
            circles: this.circles.map((circle) => ({
                ...circle,
                color: circle.color.serialize(),
            }))
        };
    }

    deserializeExtra (obj) {
        const { circles } = obj;
        this.circles = circles.map((circle) => ({
            ...circle,
            color: RGB.fromObject(circle.color)
        }));
    }
}
