
import * as _ from 'lodash';
import * as PubSub from 'pubsub-js';
import { IOscillator, IWaveParams, WaveType } from '../../types';
import * as util from '../../util';


let oscillatorCount = 0;

export default class Oscillator implements IOscillator {
    waveFunction = null;
    theta = 0;

    private velocity = 2 * Math.PI;
    private subscribers = [];
    private id = oscillatorCount++;
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
        PubSub.publish(this.event, this.value);
    };

    private get event () {
        return `oscillator.${this.id}`;
    }

    private makeWaveFunction () {
        switch (this.params.type) {
            case WaveType.Sine:
                this.waveFunction = v => Math.sin(v * this.params.frequency);
                break;
            case WaveType.Square:
                this.waveFunction = (v) => {
                    return v % this.wavelength < this.wavelength / 2
                        ? 1
                        : -1;
                };
                break;
            case WaveType.Triangle: {
                const wavelength = this.wavelength;
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
                const slope = -this.params.amplitude / (this.wavelength / 2);
                this.waveFunction = (v) => (v % this.wavelength) * slope + this.params.amplitude;
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

    subscribe (fn) {
        const token = PubSub.subscribe(this.event, (msg, value) => fn(value));
        this.subscribers.push(token);
        return token;
    }

    unsubscribe (token) {
        PubSub.unsubscribe(token);

        // If there are no more subscribers, clear the interval so the oscillator can be garbage
        // collected
        this.subscribers = _.without(this.subscribers, token);
        if (this.subscribers.length === 0) clearInterval(this.interval);
    }

    updateWave (params) {
        _.merge(this.params, params);
        this.makeWaveFunction();
    }
}
