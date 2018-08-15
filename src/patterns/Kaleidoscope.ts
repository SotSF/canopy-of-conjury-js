
import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP, NUM_STRIPS } from '../canopy';
import { pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import { HSV } from '../colors';
import Memoizer from './memoizer';

class Wave {
    amp: number;
    theta: number;
    brightness: number = 1;
    hue: number;
    done: boolean = false;
    flip: number;
    t: number = 0;
    width: number = 1;

    constructor (amp) {
        this.amp = amp;
        this.hue = Math.floor(Math.random() * 360);
        this.flip = Math.random() > 0.5 ? 1 : -1;
        this.width = Math.floor(Math.random() * 5 + 2);
    }

    update (velocity) : void {
        this.t += velocity;
          if (this.t > 300) this.brightness -= 0.05;
          if (this.brightness < 0) this.done = true;
          this.hue = (this.hue + 5) % 360;
    }
}


interface KaleidoscopePropTypes {
    velocity: number,
    brightness: number,
    rotate: number
}


@pattern()
export class Kaleidoscope extends BasePattern {
    static displayName = 'Kaleidoscope';
    static propTypes = {
        velocity: new PatternPropTypes.Range(1,5),
        brightness: new PatternPropTypes.Range(0, 100),
        rotate: new PatternPropTypes.Range(0,2)
    };

    static defaultProps () : KaleidoscopePropTypes {
        return {
            velocity: 2,
            brightness: 100,
            rotate: 1
        };
    }

    private waves: Wave[] = [];
    private dimension: number = 400;
    private frequencies: number[] = [3,4,6,8,12];
    private frequency: number = 6;
    memoizer = new Memoizer();
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
            wave.update(this.props.velocity);
            if (wave.done) {
                this.waves = _.without(this.waves, wave);
               
            }
        });
        this.iteration++;
    }

    render (canopy) {
        const mirror = Math.floor(NUM_STRIPS / this.frequency);
        const memoizedMap = this.memoizer.createMap(this.dimension, canopy);
        this.waves.forEach(wave => {
            const waveColor = (new HSV(wave.hue / 360, 1, wave.brightness)).toRgb();
            const color = waveColor.withAlpha(this.props.brightness/100)
            for (let t = 0; t < wave.t; t++) {
                const x = t + this.dimension / 2
                const y = Math.floor(wave.flip * wave.amp * Math.sin(t * 0.2 * wave.amp)) + this.dimension / 2;
                const co = memoizedMap.mapCoords(x % this.dimension, y % this.dimension);
                if (co.led >= 0 && co.led < NUM_LEDS_PER_STRIP) {
                    for (let s = 0; s < this.frequency; s++) {
                        for (let i = 0; i < wave.width; i++) {
                            let strip = Math.floor((this.iteration / 3 * this.props.rotate) + co.strip + i + mirror * s) % NUM_STRIPS;
                            canopy.strips[strip].updateColor(co.led, color);
                        }
                    }
                }
                
            }
        });
    }
}
