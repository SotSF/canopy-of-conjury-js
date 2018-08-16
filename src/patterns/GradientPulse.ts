
import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB, Color } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface GradientPulseProps {
    color1: Color,
    color2: Color,
    opacity: MaybeOscillator<number>
}

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
@pattern()
export class GradientPulse extends BasePattern {
    static displayName = "Gradient Pulse";
    static propTypes = {
        color1: new PatternPropTypes.Color(),
        color2: new PatternPropTypes.Color(),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation()
    };

    static defaultProps () : GradientPulseProps {
        return {
            color1: RGB.random(),
            color2: RGB.random(),
            opacity: 1
        };
    }

    beatList = [];
    offset = 0;
    dir = 1;

    progress () {
        // any consts dependent on tunable params need to be set here
        // to account for dynamic changes
        const color1 = this.props.color1;
        const color2 = this.props.color2;

        // pattern-logic: randomly add new ring is <25 rings total
        if (Math.random() > 0.5 && this.beatList.length < 25) {
            const c = new RGB(
                util.lerp(color1.r, color2.r, this.offset),
                util.lerp(color1.g, color2.g, this.offset),
                util.lerp(color1.b, color2.b, this.offset)
            );

            this.beatList.push({ pos: 0, c });
            this.offset += 0.05 * this.dir;

            if (this.offset >= 1) {
                this.offset = 1;
                this.dir = -1;
            } else if (this.offset <= 0) {
                this.offset = 0;
                this.dir = 1;
            }
        }

        // go through every position in beatList, and light up the corresponding LED in all strips
        this.beatList.forEach((beat) => {
            // increment the position of each beat for the next go-around
            beat.pos++;

            // remove if the position is too big
            if (beat.pos >= NUM_LEDS_PER_STRIP) {
                this.beatList = _.without(this.beatList, beat);
            }
        });
    }

    render (canopy) {
        this.beatList.forEach((beat) => {
            const opacity = _.result<number>(this.props, 'opacity');
            const color = beat.c.withAlpha(opacity);
            canopy.strips.forEach((strip) => strip.updateColor(beat.pos, color));
        });
    }
}
