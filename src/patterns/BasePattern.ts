
import * as _ from 'lodash';
import { NUM_COLS, NUM_ROWS } from '../grid';
import { RGB, isColor } from '../colors';
import { GridInterface, PatternInstance, PatternInterface } from '../types';
import * as util from '../util';
import { isOscillatorWrapper, Oscillator, OscillatorWrapper, PatternPropTypes } from './utils';


export default abstract class BasePattern implements PatternInstance {
    props = null;
    values = null;
    iteration = 0;

    // Patterns are typically produced assuming they will be run on a grid with 25 rows
    // of 20 LEDs each. Sometimes this isn't true, however. This function will scale the
    // coordinate from the standard-sized grid to whatever is given.
    static convertCoordinate (coordinate, grid: GridInterface) {
        const { row, col } = coordinate;

        const convertedRow = Math.round(
            util.scale(row, 0, NUM_ROWS - 1, 0, grid.numRows - 1)
        );

        const convertedCol = Math.round(
            util.scale(col, 0, NUM_COLS - 1, 0, grid.numCols - 1)
        );

        return { row: convertedRow, col: convertedCol };
    }

    serialize () {
        const serializeProp = (value) => {
            if (typeof value === 'object' && 'serialize' in value) {
                // @ts-ignore
                return value.serialize();
            } else if (_.isArray(value)) {
                return value.map(serializeProp)
            } else {
                return value;
            }
        };

        // Serialize the props
        const props = {};
        Object.entries(this.props).forEach(([name, value]) => {
            props[name] = serializeProp(value);
        });

        return {
            // @ts-ignore
            type: this.constructor.displayName,
            props,
            extra: this.serializeExtra(),
            iteration: this.iteration
        };
    }

    // Should be overridden in inheriting classes if they have any additional parameters that must
    // be serialized
    serializeExtra () { return {}; }
    deserializeExtra (extra) {}

    deserializeProps (props) {
        const parseProp = (propType, value) => {
            if (propType instanceof PatternPropTypes.Color) {
                if (isColor(value)) {
                    return RGB.fromObject(<RGB>value);
                } else {
                    return OscillatorWrapper.fromObject(value)
                }
            } else if (propType instanceof PatternPropTypes.Array) {
                return value.map(v => parseProp(propType.types, v));
            } else if (propType instanceof PatternPropTypes.Oscillator) {
                return new Oscillator(value);
            } else {
                return OscillatorWrapper.fromObject(value) || value;
            }
        };

        // Deserialize the props
        const deserialized = {};
        Object.entries(props).forEach(([name, value]) => {
            const propType = (<PatternInterface>this.constructor).propTypes[name];
            deserialized[name] = parseProp(propType, value);
        });

        return deserialized;
    }

    deserialize (state) {
        this.updateProps(this.deserializeProps(state.props));
        this.deserializeExtra(state.extra);
        this.iteration = state.iteration;
    }

    // These must each be implemented in inheriting classes
    abstract render (grid: GridInterface);

    constructor (props) {
        // If no props are provided, use the default props
        // @ts-ignore: I don't know how to teach typescript that class will have the static property
        this.props = props || this.constructor.defaultProps();
    }

    progress () {
        this.iteration++;

        // If any of the props are oscillators
        this.values = {};
        Object.entries(this.props).forEach(([name, value]) => {
            if (isOscillatorWrapper(value)) {
                this.values[name] = value.value();
            } else {
                this.values[name] = value;
            }
        });
    }

    updateProps (props) {
        _.merge(this.props, props);
    }
}
