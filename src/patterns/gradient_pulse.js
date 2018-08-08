
import _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB } from '../colors';
import * as util from '../util';

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
export class GradientPulse {
    // define tuning params
    static menuParams = [
        { name: "Color1", defaultVal: {r: 255, g: 0, b: 0} },
        { name: "Color2", defaultVal: {r: 0, g: 0, b: 255} },
        { name: "Brightness", defaultVal: 100, min: 0, max: 100 }
    ];

    // define display name
    static displayName = "Gradient Pulse";

    constructor(params) {
        // set instance params
        this.params = params;

        this.beatList = [];
        this.offset = 0;
        this.dir = 1;
    }

    progress () {
        // any consts dependent on tunable params need to be set here
        // to account for dynamic changes
        const color1 = this.params.Color1;
        const color2 = this.params.Color2;

        // pattern-logic: randomly add new ring is <25 rings total
        if (Math.random() > 0.5 && this.beatList.length < 25) {
            const c = {
                r: util.lerp(color1.r, color2.r, this.offset),
                g: util.lerp(color1.g, color2.g, this.offset),
                b: util.lerp(color1.b, color2.b, this.offset)
            };

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
            // apply brightness mod
            const { r, g, b } = beat.c;
            const color = new RGB(r, g, b, this.params.Brightness / 100);
            canopy.strips.forEach((strip) => strip.updateColor(beat.pos, color));
        });
    }
}
