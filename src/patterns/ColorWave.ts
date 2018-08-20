
import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP, NUM_STRIPS } from '../canopy';
import { Color, RGB } from '../colors';
import {IOscillator, MaybeOscillator, pattern, WaveType} from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
import { Oscillator, PatternPropTypes } from './utils';


interface ColorWaveProps {
    color: MaybeOscillator<Color>
    midPoint: number
    oscillator: IOscillator
}

/**
 * A strip in the canopy is chosen to be the midline, and from there a wave oscillates, emitting
 * colors
 */
@pattern()
export class ColorWave extends BasePattern {
    static displayName = 'Color Wave';

    static propTypes = {
        color: new PatternPropTypes.Color().enableOscillation({
            frequency: 0.1,
        }),
        midPoint: new PatternPropTypes.Range(0, NUM_STRIPS - 1).enableOscillation({
            frequency: 0.3,
            type: WaveType.Saw,
        }),
        oscillator: new PatternPropTypes.Oscillator({
            frequency: 0.5
        })
    };

    static defaultProps () : ColorWaveProps {
        return {
            color: RGB.random(),
            midPoint: NUM_STRIPS / 2,
            oscillator: new Oscillator(this.propTypes.oscillator.defaults)
        };
    }

    render (canopy) {
        // Sample the wave once for each LED in a strip
        const values = this.values.oscillator.sampleN(NUM_LEDS_PER_STRIP);

        _.range(NUM_LEDS_PER_STRIP).forEach((ledIndex) => {
            const unboundedStrip = Math.round(this.values.midPoint + values[ledIndex] * 10);
            const waveStrip = util.clampModular(unboundedStrip, 0, NUM_STRIPS);
            canopy.strips[waveStrip].updateColor(ledIndex, this.values.color);
        });
    }

    serializeExtra () {
        return {
        };
    }

    deserializeExtra (obj) {
    }
}
