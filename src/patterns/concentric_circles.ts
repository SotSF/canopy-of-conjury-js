
import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { Color, HSV } from '../colors';
import {pattern, PatternPropType} from '../types';


interface ConcentricCirclesProps {
    color: Color,
    period: number
}

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
@pattern()
export class ConcentricCircles {
    circles = [];
    iteration = 0;

    static propTypes = {
        color: PatternPropType.Color,
        period: PatternPropType.Range
    };

    static defaultProps () {
        return {
            color: new HSV(0.5, 1, 1),
            period: 5
        };
    }

    update (properties: ConcentricCirclesProps) {
        if (this.iteration++ % properties.period === 0) {
            this.circles.push({ pos: 0, color: properties.color });
        }

        // go through every position in beatList, and light up the corresponding LED in all strips
        this.circles.forEach((circle) => {
            // increment the position of each beat for the next go-around
            circle.pos++;

            // remove if the position is too big
            if (circle.pos >= NUM_LEDS_PER_STRIP) {
                this.circles = _.without(this.circles, circle);
            }
        });
    }

    render (canopy) {
        this.circles.forEach((circle) => {
            canopy.strips.forEach((strip) => {
                strip.updateColor(circle.pos, circle.color.toRgb());
            });
        });
    }
}
