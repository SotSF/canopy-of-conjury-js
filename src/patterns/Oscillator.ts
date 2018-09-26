import { pattern } from "../types";
import BasePattern from "./BasePattern";
import { PatternPropTypes } from "./utils/pattern_prop_types";
import * as waves from './Synth/waves';
import { RGB } from "../colors/index";
import { Color } from "../colors/types";
import { NUM_LEDS_PER_STRIP, NUM_STRIPS } from "../canopy/constants";

enum WaveType {
    Sine,
    Saw,
    Pulse
}

class OscillatorProps {
    Color: Color
    FreqExp: number
    FreqFine: number
    Sync: number
    Wave: number
    PulseWidth: number
    Mix: number
    Mod: number
}

const TOTAL_NUM_LEDS = NUM_STRIPS * NUM_LEDS_PER_STRIP;
const SCAN_SPEED = TOTAL_NUM_LEDS;

@pattern()
export class Oscillator extends BasePattern {
    static displayName = 'Oscillator';

    static propTypes = {
        Color: new PatternPropTypes.Color,
        FreqExp: new PatternPropTypes.Range(0,5,0.1),
        FreqFine: new PatternPropTypes.Range(0,100),
        Sync: new PatternPropTypes.Range(-5,5,0.5),
        Wave: new PatternPropTypes.Enum(WaveType),
        PulseWidth: new PatternPropTypes.Range(0,0.5,0.05),
        Mix: new PatternPropTypes.Range(0,1,0.05),
        Mod: new PatternPropTypes.Range(0,1,0.05)
    };

    static defaultProps () : OscillatorProps {
        return {
            Color: RGB.random(),
            FreqExp: 0,
            FreqFine: 0,
            Sync: 0,
            Wave: WaveType.Sine,
            PulseWidth: 0.5,
            Mix: 1,
            Mod: 0.5
        }
    }

    private val : number = 0;

    OscValue() {
        this.val;
    }

    applyColor = (color, oscValue) => {
        return new RGB(color.r * oscValue,
            color.g * oscValue,
            color.b * oscValue
        )
      };

    getWave() {
        switch (this.values.Wave) {
            case WaveType.Sine:
                return waves["sine"]();
            case WaveType.Saw:
                return waves["saw"]();
            case WaveType.Pulse:
                return waves["pulse"](this.values.PulseWidth);

        }
    }

    render (canopy, prevOsc = 0) {
        canopy.strips.forEach((strip, s) => {
            strip.leds.forEach((led, l) => {
                const ledIndex = (s * NUM_LEDS_PER_STRIP + l);

                const oscFreq = Math.pow(10, this.values.FreqExp + this.values.FreqFine/1000);
                const wave = this.getWave();
                const t = Date.now() / 1000;
                const phase = prevOsc == 0 ? 0 : prevOsc * this.values.Mod;
                const oscVal = (wave(oscFreq, t * this.values.Sync + phase, ledIndex / SCAN_SPEED) + 1) / 2;
                this.val = oscVal;
                const oscColor = this.applyColor(this.values.Color, oscVal * this.values.Mix);
                canopy.strips[s].updateColor(l, oscColor);
            })
        })
    }

    serializeExtra () {
        return {
        };
    }

    deserializeExtra (obj) {
    }
}