import BasePattern from "./BasePattern";
import { CanopyInterface, SoundOptions } from "../types";
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
    beat : boolean = false;
    beatAvg : number = 0;
    frequencies : Uint8Array = new Uint8Array();
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
    
    processAudio(freqs : Uint8Array) {
        this.frequencies = freqs;
        for (let i = 0; i < this.avgs.length; i++) {
            const h = 120 + (i * 10) + this.offset;
            this.avgs[i].color = new HSV(h / 360,1,1).toRgb();
            this.avgs[i].value = sound.GetFrequencyBandAverage(freqs, this.avgs[i].band);
        }
        this.beat = sound.BeatDetect(freqs);
        if (this.beat) {
            this.beatAvg = Math.max(...Array.from(freqs));
        }
        
    }

    progress(sound? : SoundOptions) {
        super.progress();

        if (sound.audio) {
            this.processAudio(sound.frequencyArray);
        }
        else { 


        }

        if (this.beatAvg > 0) this.beatAvg -= 10;
        this.offset++;
        
        
    }
    render(canopy: CanopyInterface) {
        const bandWidth = Math.round(this.frequencies.length / canopy.strips.length);
        canopy.strips.forEach((strip, s) => {
            const band = s * bandWidth;
           
            const color = new HSV(s / canopy.strips.length,1,1).toRgb();
            strip.updateColor(NUM_LEDS_PER_STRIP - 1, color);
            const lightBand = Math.floor(NUM_LEDS_PER_STRIP / this.avgs.length) - 5;

            // center rings
            this.avgs.forEach((a,i) => {
                const start = i * lightBand;
                for (let l = start; l < start + lightBand; l++) {
                    const aColor =  a.color.withAlpha(a.value / 255);
                    strip.updateColor(l, aColor);
                }
            });
            
            // rainbow beat ring
            for (let l = 45; l < 65; l++) {
                const h = (canopy.strips.length - s + this.offset) % canopy.strips.length ;
                const c = new HSV(h / canopy.strips.length,1,1).toRgb().withAlpha(this.beatAvg/255);
                strip.updateColor(l,c);
            }

            // outer waveform
            let avg = 0;
            for (let i = band; i <= band + bandWidth; i++) {
                const f = i + this.offset;
                avg += this.frequencies[f % this.frequencies.length];
            }
            avg = Math.ceil(avg / bandWidth / 5);
            if (avg > 0) {
                for (let l = NUM_LEDS_PER_STRIP - avg; l < NUM_LEDS_PER_STRIP - 1; l++) {
                    strip.updateColor(l, color.withAlpha(0.8))
                }
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