import {NUM_STRIPS, NUM_LEDS_PER_STRIP} from '../canopy';
import {RGB} from '../colors';
import {PCanvas} from '.';

export class Map {
    static menuParams = [
        {name: "Letter", defaultVal: 7},
        {name: "Time", defaultVal: 8.75}
    ];
    static displayName = "Map of BRC";

    HOUR = new RGB(200,150,0,0.7);
    HALF_HOUR = new RGB(200,150,0,0.4);
    BLACK = new RGB(0,0,0,1);
    POI_COLOR = new RGB(0,255,255);
    HOME_COLOR = new RGB(255,0,0);

    blocksize = 5;
    esplanade = this.blocksize;
    fGaps = [
        [2,2.5], [3.5,4], [5,7], [8,8.5], [9.5,10]
    ];

    HOME = [8.75, 7]; // 8:45 & G

    constructor(params) {
        this.params = params;
        
        this.blink = true;
    }
    update() {
        this.blink = !this.blink;
    }
    render(canopy) {
        // esplanade
        for (let s = this.getTime(10); s <= this.getTime(2); s++) {
            canopy.strips[s].updateColor(this.esplanade, this.HOUR);
        }

         // letters
         for (let l = 1; l < 13; l++) {
            for (let s = this.getTime(10); s <= this.getTime(2); s++) {
                canopy.strips[s].updateColor(this.getLetter(l), this.HOUR);
            }

            // f has a bunch of gaps
            if (l == 6) {
                this.fGaps.forEach(gap => {
                    for (let i = this.getTime(gap[1]) + 1; i < this.getTime(gap[0]); i++) {
                        canopy.strips[i].updateColor(this.getLetter(l), this.BLACK);
                    }
                });
            }
        }

        // hours and half-hours
        for (let h = 2; h <= 10; h += 0.5) {
            const time = this.getTime(h);
            for (let l = this.esplanade; l <= this.getLetter(12); l++) {
                canopy.strips[time].updateColor(l, h % 1 == 0 ? this.HOUR : this.HALF_HOUR);
            }
        }

        // ring road
        const dStreet = this.getLetter(4);
        for (let s = this.getTime(6.5) + 1; s < this.getTime(5.5); s++) {
            for (let l = this.esplanade; l < dStreet; l++) {
                canopy.strips[s].updateColor(l, this.BLACK);
            }
        }

        const homeTime = this.getTime(this.HOME[0]);
        const homeLetter = this.getLetter(this.HOME[1]);
        canopy.strips[homeTime].updateColor(homeLetter, this.HOME_COLOR);
        canopy.strips[homeTime+1].updateColor(homeLetter, this.HOME_COLOR);
        canopy.strips[homeTime-1].updateColor(homeLetter, this.HOME_COLOR);
        canopy.strips[homeTime].updateColor(homeLetter+1, this.HOME_COLOR);
        canopy.strips[homeTime].updateColor(homeLetter-1, this.HOME_COLOR);

        // highlight selection
        if (this.blink) {
            const strip = this.getTime(this.params.Time);
            const led = this.getLetter(this.params.Letter);
            canopy.strips[strip].updateColor(led, this.POI_COLOR);
            canopy.strips[strip].updateColor(led + 1, this.POI_COLOR);
        }
    }

    getTime = (h) => {
        return parseInt(PCanvas.lerp(NUM_STRIPS,0,h/12));
    }
    getLetter = (l) => {
        if (l == 0) return this.esplanade;
        return parseInt((l + 2) * this.blocksize);
    }
}