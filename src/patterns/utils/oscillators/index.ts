
import * as _ from 'lodash';
import { HSV, Color } from '../../../colors';
import {
    IOscillator,
    IOscillatorWrapper,
    OscillatorType,
    WaveState,
    WaveType,
    SerializedNumericOscillator,
    SerializedColorOscillator,
    OscillatorGenericTypes
} from './types';
import * as util from '../../../util';
export { MaybeOscillator } from './types';

type waveFunction = (n: number) => number;
const getWavelength = (frequency: number) => 1 / frequency * Math.PI * 2;
const makeSineWave = (amplitude: number, frequency: number): waveFunction =>
    (v: number) => amplitude * Math.sin(v * frequency);

const makeSquareWave = (amplitude: number, frequency: number): waveFunction => {
    const wavelength = getWavelength(frequency);
    return v => v % wavelength < wavelength / 2 ? amplitude : -amplitude;
}

const makeTriangleWave = (amplitude: number, frequency: number): waveFunction => {
    const wavelength = getWavelength(frequency);
    const quarterLength = wavelength / 4;
    const slope = amplitude / quarterLength;

    return (v) => {
        const remainder = v % wavelength;
        if (remainder < quarterLength) {
            return slope * remainder;
        } else if (remainder < quarterLength * 3) {
            return -slope * (remainder - quarterLength) + amplitude;
        } else {
            return slope * (remainder - quarterLength * 3) - amplitude;
        }
    };
}

const makeSawWave = (amplitude: number, frequency: number): waveFunction => {
    const wavelength = getWavelength(frequency);
    const slope = -amplitude / (wavelength / 2);
    return v => (v % wavelength) * slope + amplitude;
}


export class Oscillator implements IOscillator {
    waveFunction: waveFunction;

    static fromObject (state: WaveState) {
        return new Oscillator(state);
    }

    private velocity = 2 * Math.PI;
    private readonly interval = null;
    
    private readonly _state: WaveState = {
        amplitude: 1,
        frequency: 1,
        type: WaveType.Sine,
        theta: 0
    };

    constructor (waveState: Partial<WaveState>) {
        this.updateWave(waveState);
        this.interval = setInterval(this.update, 10);
    }

    private update = () => {
        this._state.theta += 0.1;
    };

    private makeWaveFunction () {
        const { amplitude, frequency, type } = this._state;

        switch (type) {
            case WaveType.Sine:
                this.waveFunction = makeSineWave(amplitude, frequency);
                break;
            case WaveType.Square:
                this.waveFunction = makeSquareWave(amplitude, frequency);
                break;
            case WaveType.Triangle:
                this.waveFunction = makeTriangleWave(amplitude, frequency);
                break;
            case WaveType.Saw:
                this.waveFunction = makeSawWave(amplitude, frequency);
                break;
        }
    }

    get sample () {
        return this.waveFunction(this._state.theta);
    }

    get state () {
        return { ...this._state };
    }

    /** Samples the oscillator `n` times in the interval [0, 2_PI], offset by `theta` */
    sampleN (n: number) {
        const interval = 2 * Math.PI / n;
        return _.range(n).map((i) => {
            return this.waveFunction(i * interval + this._state.theta);
        });
    }

    get wavelength () {
        const period = 1 / this._state.frequency;
        return period * this.velocity;
    }

    updateWave (waveState: Partial<WaveState>) {
        _.merge(this._state, waveState);
        this.makeWaveFunction();
    }

    serialize () {
        return this._state;
    }
}

export class NumericOscillator implements IOscillatorWrapper<number> {
    readonly type: OscillatorType = 'numeric';
    readonly oscillator: Oscillator;
    readonly min: number;
    readonly max: number;

    constructor (serialized: SerializedNumericOscillator) {
        this.oscillator = new Oscillator(serialized.oscillatorState);
        this.min = serialized.min;
        this.max = serialized.max;
    }

    value () {
        return util.scale(this.oscillator.sample, -1, 1, this.min, this.max);
    }

    serialize (): SerializedNumericOscillator {
        return {
            oscillatorState: this.oscillator.serialize(),
            oscillatorType: 'numeric',
            min: this.min,
            max: this.max
        }
    }
}

export class ColorOscillator implements IOscillatorWrapper<Color> {
    readonly type: OscillatorType = 'color';
    readonly oscillator: Oscillator;

    constructor (serialized: SerializedColorOscillator) {
        this.oscillator = new Oscillator(serialized.oscillatorState);
    }

    value () {
        const hue = util.scale(this.oscillator.sample, -1, 1, 0, 1);
        return new HSV(hue, 1, 1).toRgb();
    }

    serialize (): SerializedColorOscillator {
        return {
            oscillatorState: this.oscillator.serialize(),
            oscillatorType: 'color'
        };
    }
}

export const isOscillatorWrapper = <T extends OscillatorGenericTypes>(o: any): o is IOscillatorWrapper<T> =>
    o instanceof NumericOscillator || o instanceof ColorOscillator;
