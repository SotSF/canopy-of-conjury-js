import _ from "lodash";
import { HSV } from "@/colors";
import {
  IOscillator,
  IOscillatorWrapper,
  IWaveParams,
  IColorOscillator,
  INumericOscillator,
  ISerializedOscillator,
  WaveType,
  ISerializedOscillatorWrapper,
} from "@/types";
import * as util from "@/util";

export class Oscillator implements IOscillator {
  waveFunction: (v: number) => number;
  theta: number;

  private velocity = 2 * Math.PI;
  readonly params: IWaveParams;

  // This has a funny type because this code can run in the browser or in node, and the return type
  // of setInterval is different in each environment.
  // TODO: This value is never used and thus the interval is never cleared. This may be a memory
  // leak.
  private readonly interval: ReturnType<typeof setInterval>;

  constructor(serialization: Partial<ISerializedOscillator>) {
    const {
      theta = 0,
      amplitude = 1,
      frequency = 1,
      type = WaveType.Sine,
    } = serialization;
    this.theta = theta;
    this.params = { amplitude, frequency, type };
    this.waveFunction = this.makeWaveFunction();
    this.interval = setInterval(this.update, 10);
  }

  static fromObject(object: ISerializedOscillator) {
    const oscillatorKeys = ["amplitude", "frequency", "type", "theta"];
    const objectKeys = Object.keys(object);
    const isValid = _.every(
      oscillatorKeys.map((key) => objectKeys.includes(key))
    );

    return isValid ? new Oscillator(object) : null;
  }

  private update = () => {
    this.theta += 0.1;
  };

  private makeWaveFunction() {
    const wavelength = this.wavelength;

    switch (this.params.type) {
      case WaveType.Sine:
        return (v: number) => Math.sin(v * this.params.frequency);
      case WaveType.Square:
        return (v: number) => {
          return v % wavelength < wavelength / 2 ? 1 : -1;
        };
      case WaveType.Triangle: {
        const quarterLength = wavelength / 4;
        const slope = this.params.amplitude / quarterLength;

        return (v: number) => {
          const remainder = v % wavelength;
          if (remainder < quarterLength) {
            return slope * remainder;
          } else if (remainder < quarterLength * 3) {
            return -slope * (remainder - quarterLength) + this.params.amplitude;
          } else {
            return (
              slope * (remainder - quarterLength * 3) - this.params.amplitude
            );
          }
        };
      }
      case WaveType.Saw: {
        const slope = -this.params.amplitude / (wavelength / 2);
        return (v: number) => (v % wavelength) * slope + this.params.amplitude;
      }
    }
  }

  get sample() {
    return this.waveFunction(this.theta);
  }

  /** Samples the oscillator `n` times in the interval [0, 2_PI], offset by `theta` */
  sampleN(n: number) {
    const interval = (2 * Math.PI) / n;
    return _.range(n).map((i) => {
      return this.waveFunction(i * interval + this.theta);
    });
  }

  get wavelength() {
    const period = 1 / this.params.frequency;
    return period * this.velocity;
  }

  updateWave(params: Partial<IWaveParams>) {
    _.merge(this.params, params);
    this.makeWaveFunction();
  }

  serialize() {
    return {
      ...this.params,
      theta: this.theta,
    };
  }
}

export class OscillatorWrapper {
  oscillator: Oscillator;

  static fromObject(object: ISerializedOscillatorWrapper) {
    switch (object.type) {
      case "numeric":
        return new NumericOscillator(
          new Oscillator(object.oscillator),
          object.min,
          object.max
        );
      case "color":
        return new ColorOscillator(new Oscillator(object.oscillator));
      default:
        return null;
    }
  }

  constructor(oscillator: Oscillator) {
    this.oscillator = oscillator;
  }

  // serialize() {
  //   return this.oscillator.serialize();
  // }
}

export const isOscillatorWrapper = (o: any): o is IOscillatorWrapper => {
  return o.oscillator !== undefined;
};

export class NumericOscillator
  extends OscillatorWrapper
  implements INumericOscillator
{
  type = "numeric";
  min: number;
  max: number;

  constructor(oscillator: Oscillator, min: number, max: number) {
    super(oscillator);
    this.min = min;
    this.max = max;
  }

  value() {
    return util.scale(this.oscillator.sample, -1, 1, this.min, this.max);
  }

  serialize(): ISerializedOscillatorWrapper {
    return {
      type: this.type,
      oscillator: this.oscillator.serialize(),
      min: this.min,
      max: this.max,
    };
  }
}

export class ColorOscillator
  extends OscillatorWrapper
  implements IColorOscillator
{
  type = "color";

  value() {
    const hue = util.scale(this.oscillator.sample, -1, 1, 0, 1);
    return new HSV(hue, 1, 1).toRgb();
  }

  serialize() {
    return {
      type: this.type,
      oscillator: this.oscillator.serialize(),
      min: 0,
      max: 255,
    };
  }
}
