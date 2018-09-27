import BasePattern from "./BasePattern";
import { CanopyInterface } from "../types";
import * as sound from '../util/sound';
import { RGB, HSV } from "../colors/index";
import { NUM_LEDS_PER_STRIP } from "../canopy/constants";


export class SoundCalibrate extends BasePattern {
    static displayName = 'Sound Calibration';
    static propTypes = {
    };

    static defaultProps () {
        return {};
    }

    avgs = {};
    frequencies = [];

    constructor(...props) {
        //@ts-ignore
        super(...props);

        for (var band in sound.FrequencyBand) {
            this.avgs[band] = false;
        }
    }
    
    processAudio(freqs) {
        this.frequencies = freqs;
        for (var band in sound.FrequencyBand) {
            const avg = sound.GetFrequencyBandAverage(freqs, band);
            if (band === sound.FrequencyBand.Sub) {
                this.avgs[band] = avg > 250;
            }
            if (band === sound.FrequencyBand.Bass) {
                this.avgs[band] = avg > 250;
            }
            if (band === sound.FrequencyBand.LowMid) {
                this.avgs[band] = avg > 200;
            }
            if (band === sound.FrequencyBand.Mid) {
                this.avgs[band] = avg > 180;
            }
            if (band === sound.FrequencyBand.HighMid) { // cymbals && hi-hat
                this.avgs[band] = avg > 150;
            }
            if (band === sound.FrequencyBand.High) {
                this.avgs[band] = avg > 50;
            }
            
        }
    }

    progress(soundOn = false, freqs = []) {
        super.progress();
        if (soundOn) { this.processAudio(freqs); } 
        else { }
        
        
    }
    render(canopy: CanopyInterface) {
        const { avgs } = this;
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
            

            if (avgs[sound.FrequencyBand.Sub]) {
                strip.updateColor(15, new RGB(100,0,100));
                strip.updateColor(16, new RGB(100,0,100));
                strip.updateColor(17, new RGB(100,0,100));
            }
            if (avgs[sound.FrequencyBand.Bass]) {
                strip.updateColor(20, new RGB(0,0,200));
                strip.updateColor(21, new RGB(0,0,200));
                strip.updateColor(22, new RGB(0,0,200));
            }
            if (avgs[sound.FrequencyBand.LowMid]) {
                strip.updateColor(25, new RGB(50,0,200));
                strip.updateColor(26, new RGB(50,0,200));
                strip.updateColor(27, new RGB(50,0,200));
                strip.updateColor(28, new RGB(50,0,200));
            }
            if (avgs[sound.FrequencyBand.Mid]) {
                strip.updateColor(32, new RGB(150,0,100));
                strip.updateColor(33, new RGB(150,0,100));
                strip.updateColor(34, new RGB(150,0,100));
            }
            if (avgs[sound.FrequencyBand.HighMid]) {
                strip.updateColor(37, new RGB(200,50,150));
                strip.updateColor(38, new RGB(200,50,150));
            }
            if (avgs[sound.FrequencyBand.High]) {
                strip.updateColor(45, new RGB(255,0,100));
            }
        })
    }

    serializeExtra () {
        return {
        };
    }

    deserializeExtra (obj) {
    }

}