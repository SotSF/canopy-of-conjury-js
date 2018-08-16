
import * as _ from 'lodash';
import { IOscillator, IWaveParams, WaveType } from '../../types';
import * as util from '../../util';


export default class Oscillator implements IOscillator<number> {
    waveFunction = null;
    theta = 0;

    static fromObject (object) {
        const oscillatorKeys = ['amplitude', 'frequency', 'type', 'theta'];
        const objectKeys = Object.keys(object);
        const isValid = _.every(oscillatorKeys.map(key => objectKeys.includes(key)));

        if (isValid) {
            const oscillator = new Oscillator({
                amplitude: object.amplitude,
                frequency: object.frequency,
                type: object.type
            });

            oscillator.theta = object.theta;
            return oscillator;
        }

        // Not a valid serialized oscillator
        return null;
    }

    private velocity = 2 * Math.PI;
    private readonly interval = null;
    readonly params: IWaveParams = {
        amplitude: 1,
        frequency: 1,
        type: WaveType.Sine
    };

    constructor (params) {
        this.updateWave(params);
        this.interval = setInterval(this.update, 10);
    }

    private update = () => {
        this.theta += 0.1;
    };

    private makeWaveFunction () {
        const wavelength = this.wavelength;

        switch (this.params.type) {
            case WaveType.Sine:
                this.waveFunction = v => Math.sin(v * this.params.frequency);
                break;
            case WaveType.Square:
                this.waveFunction = (v) => {
                    return v % wavelength < wavelength / 2
                        ? 1
                        : -1;
                };
                break;
            case WaveType.Triangle: {
                const quarterLength = wavelength / 4;
                const slope = this.params.amplitude / quarterLength;

                this.waveFunction = (v) => {
                    const remainder = v % wavelength;
                    if (remainder < quarterLength) {
                        return slope * remainder;
                    } else if (remainder < quarterLength * 3) {
                        return -slope * (remainder - quarterLength) + this.params.amplitude;
                    } else {
                        return slope * (remainder - quarterLength * 3) - this.params.amplitude;
                    }
                };
                break;
            }
            case WaveType.Saw: {
                const slope = -this.params.amplitude / (wavelength / 2);
                this.waveFunction = (v) => (v % wavelength) * slope + this.params.amplitude;
                break;
            }
        }
    }

    get value () {
        return this.waveFunction(this.theta);
    }

    get wavelength () {
        const period = 1 / this.params.frequency;
        return period * this.velocity;
    }

    scaled (min, max) {
        return util.scale(this.value, -1, 1, min, max);
    }

    updateWave (params) {
        _.merge(this.params, params);
        this.makeWaveFunction();
    }

    serialize () {
        return {
            ...this.params,
            theta: this.theta
        };
    }
}