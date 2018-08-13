
import * as _ from 'lodash';
import { pattern } from '../types';
import { PCanvas } from './canvas';
import { BaseProcessingPattern } from './BasePattern';
import { PatternPropTypes } from './utils';
import { HSV, RGB } from '../colors';

class Wave {
    amp: number;
    theta: number;
    brightness: number = 1;
    hue: number;
    done: boolean = false;
    flip: number;
    t: number = 0;

    constructor (amp) {
        this.amp = amp;
        this.hue = Math.floor(Math.random() * 360);
        this.flip = Math.random() > 0.5 ? 1 : -1;
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
    brightness: number
}


@pattern()
export class Kaleidoscope extends BaseProcessingPattern {
    static displayName = 'Kaleidoscope';
    static propTypes = {
        velocity: new PatternPropTypes.Range(1,5),
        brightness: new PatternPropTypes.Range(0, 100)
    };

    static defaultProps () : KaleidoscopePropTypes {
        return {
            velocity: 2,
            brightness: 100
        };
    }

    private waves: Wave[] = [];
    private waveAngle: number = 0;

    progress () {
        super.progress();

        const { processing } = this.canvas;
        const halfCanvas = PCanvas.dimension / 2;
        processing.pg.beginDraw();
        processing.pg.background(0);
        processing.pg.pushMatrix();
        processing.pg.translate(halfCanvas, halfCanvas);

        // add a new wave
        if (Math.random() > 0.6 && this.waves.length < 3) {
            const bassAmp = Math.random() * 95 + 5;
            this.waves.push(new Wave(bassAmp));
        }

        // order the waves prior to rendering-- render ones with larger amplitudes first
        const sortedWaves = _.sortBy(this.waves, 'amplitude').reverse();
        sortedWaves.forEach((wave) => {
            this.renderWave(wave);

            wave.update(this.props.velocity);
            if (wave.done) {
                this.waves = _.without(this.waves, wave);
            }
        });

        this.waveAngle -= 0.01;
        processing.pg.popMatrix();
        processing.pg.endDraw();
    }

    renderWave (wave: Wave) : void {
        const image = this.canvas.processing.pg;

        image.pushMatrix();
        image.rotate(wave.theta);
        image.rotate(this.waveAngle);
        const waveColor = (new HSV(wave.hue / 360, 1, wave.brightness)).toRgb();
        const color = PCanvas.color(waveColor.r, waveColor.g, waveColor.b, 255 * this.props.brightness / 100);
        image.fill(color);
        for (let i = 0; i < 6; i++) {
            image.rotate(Math.PI / 3);
            image.beginShape();

            for (let x = 0; x < wave.t; x += 5) {
                let y = wave.flip * wave.amp * Math.sin(x * 0.2 * wave.amp);
                image.curveVertex(x, y);
            }

            image.endShape();
        }
        image.popMatrix();
    }

    render (canopy) {
      this.canvas.render(canopy);
    }
}
