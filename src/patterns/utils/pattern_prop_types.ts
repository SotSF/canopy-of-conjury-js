import { Enumeration, EnumType, IWaveParams } from "@/types";

class OscillationType {
  oscillation = false;
  defaults: Partial<IWaveParams> = {};

  enableOscillation(defaults: Partial<IWaveParams> = {}) {
    this.oscillation = true;
    this.defaults = defaults;
    return this;
  }
}

export class Range extends OscillationType {
  min: number;
  max: number;
  step: number;

  constructor(min: number, max: number, step = 1) {
    super();

    this.min = min;
    this.max = max;
    this.step = step;
  }
}

export class Color extends OscillationType {}

export class Enum implements EnumType {
  options: Enumeration;

  // TODO: Figure out how to type this properly. It should only accept enums.
  constructor(options: any) {
    this.options = options;
  }

  values() {
    let i = 0;
    const values = [];

    while (Object.hasOwnProperty.call(this.options, i)) {
      values.push(this.options[i++]);
    }

    return values;
  }

  value(index: number) {
    return this.options[index];
  }

  index(value: string) {
    return this.options[value];
  }
}

export class Boolean {}

type ArrayType = EnumType | Range | Color | Boolean;
export class Array {
  types: ArrayType;

  constructor(types: { new (): ArrayType }) {
    this.types = new types();
  }
}

export class Oscillator {
  defaults: Partial<IWaveParams> = {};
  constructor(defaults: Partial<IWaveParams> = {}) {
    this.defaults = defaults;
  }
}
