
import * as _ from 'lodash';
import { NUM_STRIPS } from '../canopy';
import { MaybeOscillator, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import { HSV } from '../colors';
import Memoizer from './memoizer';


class Wave {
    amp: number;
    theta: number;
    opacity: number = 1;
    hue: number;
    done: boolean = false;
    flip: number;
    t: number = 0;
    width: number = 1;

    static fromObject (object) {
        const wave = new Wave(object.amp);

        wave.theta = object.theta;
        wave.opacity = object.opacity;
        wave.hue = object.hue;
        wave.done = object.done;
        wave.flip = object.flip;
        wave.t = object.t;
        wave.width = object.width;

        return wave;
    }

    constructor (amp) {
        this.amp = amp;
        this.hue = Math.floor(Math.random() * 360);
        this.flip = Math.random() > 0.5 ? 1 : -1;
        this.width = Math.floor(Math.random() * 5 + 2);
    }

    update (velocity) : void {
        this.t += velocity;
          if (this.t > 300) this.opacity -= 0.05;
          if (this.opacity < 0) this.done = true;
          this.hue = (this.hue + 5) % 360;
    }

    serialize () {
        return {
            amp: this.amp,
            theta: this.theta,
            opacity: this.opacity,
            hue: this.hue,
            done: this.done,
            flip: this.flip,
            t: this.t,
            width: this.width,
        };
    }
}

interface KaleidoscopePropTypes {
    velocity: number
    opacity: MaybeOscillator<number>
    rotate: number
}

@pattern()
export class Kaleidoscope extends BasePattern {
    static displayName = 'Kaleidoscope';
    static propTypes = {
        velocity: new PatternPropTypes.Range(1,5),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation(),
        rotate: new PatternPropTypes.Range(0, 2)
    };

    static defaultProps () : KaleidoscopePropTypes {
        return {
            velocity: 2,
            opacity: 1,
            rotate: 1
        };
    }

    private readonly dimension: number = 400;
    private readonly frequencies: number[] = [3, 4, 6, 8, 12];
    readonly memoizer = new Memoizer();

    private waves: Wave[] = [];
    private frequency: number = 6;

    progress () {
        super.progress();

        // add a new wave
        if (Math.random() > 0.6 && this.waves.length < 3) {
            this.frequency = this.frequencies[Math.floor(Math.random() * this.frequencies.length)];
            const bassAmp = Math.floor(Math.random() * NUM_STRIPS / 2 + 5);
            this.waves.push(new Wave(bassAmp));
        }

        // order the waves prior to rendering-- render ones with larger amplitudes first
        const sortedWaves = _.sortBy(this.waves, 'amplitude').reverse();
        sortedWaves.forEach((wave) => {
            wave.update(this.values.velocity);
            if (wave.done) {
                this.waves = _.without(this.waves, wave);
               
            }
        });
    }

    render (canopy) {
        const mirror = Math.floor(NUM_STRIPS / this.frequency);
        const memoizedMap = this.memoizer.createMap(this.dimension, canopy);
        this.waves.forEach(wave => {
            const waveColor = (new HSV(wave.hue / 360, 1, wave.opacity)).toRgb();
            const color = waveColor.withAlpha(this.values.opacity);
            for (let t = 0; t < wave.t; t++) {
                const x = t + this.dimension / 2
                const y = Math.floor(wave.flip * wave.amp * Math.sin(t * 0.2 * wave.amp)) + this.dimension / 2;
                const co = memoizedMap.mapCoords(x % this.dimension, y % this.dimension);

                // If the coordinate is beyond the canopy, don't do anything
                if (!_.inRange(co.led, 0, canopy.stripLength)) continue

                for (let s = 0; s < this.frequency; s++) {
                    for (let i = 0; i < wave.width; i++) {
                        let strip = Math.floor((this.iteration / 3 * this.values.rotate) + co.strip + i + mirror * s) % NUM_STRIPS;
                        canopy.strips[strip].updateColor(co.led, color);
                    }
                }

            }
        });
    }

    serializeExtra () {
        return {
            frequency: this.frequency,
            waves: this.waves.map(wave => wave.serialize())
        };
    }

    deserializeExtra (object) {
        this.frequency = object.frequency;
        this.waves = object.waves.map(waveProps => Wave.fromObject(waveProps));
    }
}
