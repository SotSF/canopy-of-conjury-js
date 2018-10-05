import * as _ from 'lodash';
import BasePattern from "./BasePattern";
import { SoundOptions, pattern } from "../types";
import { Color } from "../colors/types";
import * as sound from '../util/sound';
import { HSV } from "../colors/index";
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from "../canopy/constants";
import { PatternPropTypes } from "./utils/pattern_prop_types";

interface Lightstrip {
    strip: number
    hue: number
    opacity: number
}

@pattern()
export class SoundStrip extends BasePattern {
    static displayName = 'Sound Strip';

    currentCenter: number = 0;
    currentHue: number = 0;
    
    strips : Lightstrip[] = [];
    processAudio(freqs: Uint8Array) {
        const isBeat = sound.BeatDetect(freqs);
        const mid = sound.BeatDetect(freqs,sound.FrequencyBand.Mid)
        
        if (isBeat || mid) {
            const amp = Math.ceil(sound.GetAverageAmplitude(freqs) / 16);
            for (let i = 0; i < amp; i++) {
                const strip = Math.floor(Math.random() * NUM_STRIPS);
                this.strips.push({
                    strip,
                    hue: this.currentHue,
                    opacity: 1
                })
            }
        }
    }
    progress (sound? : SoundOptions) {
        super.progress();
        if (sound.audio) { this.processAudio(sound.frequencyArray); }
        else {  
            if (Math.random() > 0.6) {
                const strip = Math.floor(Math.random() * NUM_STRIPS);
                this.strips.push({
                    strip,
                    hue: this.currentHue,
                    opacity: 1
                })
            }
        }
       
        this.strips.forEach(strip => {
            strip.opacity -= 0.025;
            strip.hue = (strip.hue + 0.01) % 1;
            if (strip.opacity < 0) { this.strips = _.without(this.strips, strip); }
        })

        this.currentHue = (this.currentHue + 0.05) % 1;
    }

    render (canopy) {
       this.strips.forEach(strip => {
        const c = new HSV(strip.hue,1,1).toRgb().withAlpha(strip.opacity);
           for (let i = -2; i <= 2; i++) {
               let s = strip.strip + i;
               if (s < 0) s += NUM_STRIPS;
               s %= NUM_STRIPS;
               canopy.strips[s].updateColors(c);
           }
        });
    }

    serializeExtra () {
        return {
        };
    }

    deserializeExtra (obj) {
    }
}