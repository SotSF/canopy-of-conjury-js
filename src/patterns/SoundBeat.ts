import BasePattern from "./BasePattern";
import { SoundOptions, pattern } from "../types";
import { Color } from "../colors/types";
import * as sound from '../util/sound';
import { HSV } from "../colors/index";


interface Ring {
    beat: boolean
    opacity: number
}

@pattern()
export class SoundBeat extends BasePattern {
    static displayName = 'Sound Beats';

    static propTypes = {
    };

    static defaultProps () {
        return {
            
        }
    }

    currHue = 0;
    rings : Ring[] = [];
    constructor(props) { 
        super(props);

        for (let i = 0; i < sound.TotalBands; i++) {
            this.rings.push({
                beat: false,
                opacity: 0
            });
        }
    }
    processAudio(freqs: Uint8Array) {
        const isBeat = sound.BeatDetect(freqs);
        if (isBeat) { this.currHue += 10; }
        for (let i = 0; i < sound.TotalBands; i++) {
            const band = sound.GetBand(i);
            const beat = sound.BeatDetect(freqs,band);
            const opacity = beat ? 1 : (this.rings[i].opacity > 0 ? this.rings[i].opacity - 0.05 : 0);
            this.rings[i] = {
                beat,
                opacity
            };

        }
    }
    progress (sound? : SoundOptions) {
        super.progress();
        if (sound.audio) { this.processAudio(sound.frequencyArray); }
        else {  
            this.rings.forEach(ring => {
                if (ring.opacity < 0 && Math.random() > 0.5) ring.opacity = 1;
                ring.opacity -= 0.05;
            })
            this.currHue++; 
        }
       
    }

    render (canopy) {
        const width = 10;
        canopy.strips.forEach( strip => {
            this.rings.forEach((ring,i) => {
                const start = i * (width + 3);
                const hue = this.currHue + (i * 10)
                const color = new HSV((hue%360)/360,1,1).toRgb();
               for (let l = 0 ; l < width; l++) {
                   strip.updateColor(start + l, color.withAlpha(ring.opacity));
               }
            });
        })
      
    }

    serializeExtra () {
        return {
        };
    }

    deserializeExtra (obj) {
    }
}