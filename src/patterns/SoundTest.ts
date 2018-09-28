import BasePattern from "./BasePattern";
import { CanopyInterface } from "../types";
import * as sound from '../util/sound';
import { RGB, HSV } from "../colors/index";
import { NUM_LEDS_PER_STRIP } from "../canopy/constants";
import { Color } from "../colors/types";

class FreqAvg {
    band: string
    value: number
    color: Color
}

export class SoundTest extends BasePattern {
    static displayName = 'Sound Test';
    static propTypes = {
    };

    static defaultProps () {
        return {};
    }

    avgs : FreqAvg[] = [];
    frequencies = [];
    offset = 0;
    
    constructor(...props) {
        //@ts-ignore
        super(...props);

        let i = 0;
        for (let band in sound.FrequencyBand) {
            const h = 120 + (i * 10);
            const color = new HSV(h / 360,1,1).toRgb();
            this.avgs.push({
                band,
                value: 0,
                color
            });
            i++;
        }
        
    }
    
    processAudio(freqs) {
        this.frequencies = freqs;
        for (let i = 0; i < this.avgs.length; i++) {
            const h = 120 + (i * 10) + this.offset;
            this.avgs[i].color = new HSV(h / 360,1,1).toRgb();
            this.avgs[i].value = sound.GetFrequencyBandAverage(freqs, this.avgs[i].band);
        }
        this.offset++;
    }

    progress(soundOn = false, freqs = []) {
        super.progress();
        if (soundOn) { this.processAudio(freqs); } 
        else { }
        
        
    }
    render(canopy: CanopyInterface) {
        const bandWidth = Math.round(this.frequencies.length / canopy.strips.length);
        canopy.strips.forEach((strip, s) => {
            const band = s * bandWidth;
            let avg = 0;
            for (let i = band; i <= band + bandWidth; i++) {
                avg += this.frequencies[i];
            }
            avg = Math.ceil(avg / bandWidth / 5);
            const color = new HSV(s / canopy.strips.length,1,1).toRgb();
            strip.updateColor(NUM_LEDS_PER_STRIP - 1, color);
            if (avg > 0) {
                for (let l = NUM_LEDS_PER_STRIP - avg; l < NUM_LEDS_PER_STRIP - 1; l++) {
                    strip.updateColor(l, color)
                }
            }

            const lightBand = Math.floor(NUM_LEDS_PER_STRIP / this.avgs.length) - 5;
            this.avgs.forEach((a,i) => {
                const start = i * lightBand;
                for (let l = start; l < start + lightBand; l++) {
                    const aColor =  a.color.withAlpha(a.value / 255);
                    strip.updateColor(l, aColor);
                }
            });
        });
    }

    serializeExtra () {
        return {
        };
    }

    deserializeExtra (obj) {
    }

}