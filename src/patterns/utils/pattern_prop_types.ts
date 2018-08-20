
import { EnumType, IWaveParams } from '../../types';

class OscillationType {
    oscillation = false;
    defaults: Partial<IWaveParams> = {};

    enableOscillation (defaults: Partial<IWaveParams> = {}) {
        this.oscillation = true;
        this.defaults = defaults;
        return this;
    }
}

export namespace PatternPropTypes {
    export class Range extends OscillationType {
        min = null;
        max = null;
        step = null;

        constructor (min, max, step = 1) {
            super();

            this.min = min;
            this.max = max;
            this.step = step;
        }
    }

    export class Color extends OscillationType {}

    export class Enum implements EnumType {
        options = null;

        constructor (options) {
            this.options = options;
        }

        values () {
            let i = 0;
            const values = [];

            while (Object.hasOwnProperty.call(this.options, i)) {
                values.push(this.options[i++]);
            }

            return values;
        }

        value (index) {
            return this.options[index];
        }

        index (value) {
            return this.options[value];
        }
    }

    export class Boolean {}

    export class Array {
        types = null;

        constructor (types) {
            this.types = new types();
        }
    }

    export class Oscillator {
        defaults: Partial<IWaveParams> = {};
        constructor (defaults: Partial<IWaveParams> = {}) {
            this.defaults = defaults;
        }
    }
}
