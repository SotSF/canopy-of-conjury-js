
import { RGB, BLACK } from '../colors';
import { pattern, CanopyInterface } from '../types';
import * as util from '../util';
import { PatternPropTypes } from './utils';
import BasePattern from './BasePattern';

enum StreetNames {
    Esplanade,
    Algorithm,
    Bender,
    Cylon,
    Dewey,
    Elektro,
    Fribo,
    Gort,
    HAL,
    'Iron Giant',
    'Johnny 5',
    Kinoshita,
    Leon,
}

interface MapProps {
    letter: number,
    time: number
}

@pattern()
export class Map extends BasePattern {
    static displayName = 'Map of BRC';

    static propTypes = {
        time: new PatternPropTypes.Range(0, 12, 0.25),
        letter: new PatternPropTypes.Enum(StreetNames)
    };

    static defaultProps () {
        return {
            letter: StreetNames.Gort,
            time: 8.75
        };
    }

    static getStripIndexForTime (time, canopy) {
        return Math.round(util.lerp(canopy.strips.length - 1, 0, time / 12));
    };

    static getStripIndexForLetter (l, canopy: CanopyInterface) {
        const blockSize = canopy.stripLength / 25;
        return Math.round((l + 1) * blockSize);
    }

    colors = {
        halfHour: new RGB(200, 150, 0, 0.4),
        home: new RGB(255, 0, 0),
        hour: new RGB(200, 150, 0, 0.7),
        poi: new RGB(0, 255, 255)
    };

    blink = true;
    fGaps = [
        [2,2.5], [3.5,4], [5,7], [8,8.5], [9.5,10]
    ];

    // 8:45 & G
    HOME = [8.75, 7];

    progress () {
        super.progress();
        this.blink = !this.blink;
    }

    render (canopy) {
        // esplanade
        const esplanadeIndex = Math.ceil(canopy.stripLength / 25);
        for (let s = Map.getStripIndexForTime(10, canopy); s <= Map.getStripIndexForTime(2, canopy); s++) {
            canopy.strips[s].updateColor(esplanadeIndex, this.colors.hour);
        }

         // letters
         for (let l = 1; l < 13; l++) {
            for (let s = Map.getStripIndexForTime(10, canopy); s <= Map.getStripIndexForTime(2, canopy); s++) {
                canopy.strips[s].updateColor(Map.getStripIndexForLetter(l, canopy), this.colors.hour);
            }

            // f has a bunch of gaps
            if (l == 6) {
                this.fGaps.forEach(gap => {
                    for (let i = Map.getStripIndexForTime(gap[1], canopy) + 1; i < Map.getStripIndexForTime(gap[0], canopy); i++) {
                        canopy.strips[i].updateColor(Map.getStripIndexForLetter(l, canopy), BLACK);
                    }
                });
            }
        }

        // hours and half-hours
        for (let h = 2; h <= 10; h += 0.5) {
            const time = Map.getStripIndexForTime(h, canopy);
            const color = h % 1 === 0 ? this.colors.hour : this.colors.halfHour;
            for (let l = esplanadeIndex; l <= Map.getStripIndexForLetter(12, canopy); l++) {
                canopy.strips[time].updateColor(l, color);
            }
        }

        // ring road
        const dStreet = Map.getStripIndexForLetter(4, canopy);
        for (let s = Map.getStripIndexForTime(6.5, canopy) + 1; s < Map.getStripIndexForTime(5.5, canopy); s++) {
            for (let l = esplanadeIndex; l < dStreet; l++) {
                canopy.strips[s].updateColor(l, BLACK);
            }
        }

        const homeTime = Map.getStripIndexForTime(this.HOME[0], canopy);
        const homeLetter = Map.getStripIndexForLetter(this.HOME[1], canopy);

        canopy.strips[homeTime].updateColor(homeLetter, this.colors.home);
        canopy.strips[homeTime + 1].updateColor(homeLetter, this.colors.home);
        canopy.strips[homeTime - 1].updateColor(homeLetter, this.colors.home);
        canopy.strips[homeTime].updateColor(homeLetter+1, this.colors.home);
        canopy.strips[homeTime].updateColor(homeLetter-1, this.colors.home);

        // highlight selection
        if (this.blink) {
            const strip = Map.getStripIndexForTime(this.props.time, canopy);
            const led = Map.getStripIndexForLetter(this.props.letter, canopy);
            canopy.strips[strip].updateColor(led, this.colors.poi);
            canopy.strips[strip].updateColor(led + 1, this.colors.poi);
        }
    }
}
