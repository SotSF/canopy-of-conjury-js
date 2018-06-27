
import _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { HSV } from '../colors';


/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
export class GradientPulse {
    beatList = [];
    currHue = 0;

    update () {
        const r = Math.floor(Math.random() * 100);
        if (r > 50 && this.beatList.length < 25) {
            const c = new HSV(this.currHue, 100, r * 2);
            this.currHue = (this.currHue + 1) % 360;
            this.beatList.push({ pos: 0, c });
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
            canopy.strips.forEach((strip) => {
                strip.updateColor(beat.pos, beat.c.toHex());
            });
        });
    }
}
