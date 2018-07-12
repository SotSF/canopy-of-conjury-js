
import _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { hexStringToRgb, rgbToHexString, modifyBrightness } from '../colors';

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
export class GradientPulse {
    // define tuning params
    static menuParams = [
        {name: "Color1", defaultVal: "#ff0000"},
        {name: "Color2", defaultVal: "#0000ff"}
    ];
    // define display name
    static displayName = "Gradient Pulse";

    constructor(params) {
        // set instance params
        this.params = params;

        this.processing = new Processing(document.getElementById('idCanvas'), this._setupProcessing);
        this.beatList = [];
        this.offset = 0;
        this.dir = 1;
        
    }

    update () {
        // any consts dependent on tunable params need to be set here
        // to account for dynamic changes
        const color1 = hexStringToRgb(this.params.Color1);
        const color2 = hexStringToRgb(this.params.Color2);

        // pattern-logic: randomly add new ring is <25 rings total
        const r = Math.floor(Math.random() * 100);
        if (r > 50 && this.beatList.length < 25) {
            const c = {
                r: this.processing.lerp(color1.r, color2.r, this.offset),
                g: this.processing.lerp(color1.g, color2.g, this.offset),
                b: this.processing.lerp(color1.b, color2.b, this.offset)
            };
            this.beatList.push({ pos: 0, c });
            this.offset += 0.05 * this.dir;
            if (this.offset >= 1) { this.offset = 1; this.dir = -1; }
            else if (this.offset <= 0) { this.offset = 0; this.dir = 1; }
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
            const color = modifyBrightness(this.params.Brightness, rgbToHexString(beat.c));
            canopy.strips.forEach((strip) => {
                strip.updateColor(beat.pos, color);
            });
        });
    }
}
