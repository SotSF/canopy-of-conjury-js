
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB, isColor } from '../colors';
import { CanopyInterface, PatternInstance, PatternProps, PatternStaticProperties, SerializedActivePattern } from '../types';
import * as util from '../util';
import { isOscillatorWrapper, Oscillator, PatternPropTypes, NumericOscillator, ColorOscillator } from './utils';


// Creates a unique ID for a pattern instance
const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const makeId = () => _.range(20).map(() => _.sample(characters)).join('');

export default abstract class BasePattern implements PatternInstance {
    id: string = null;
    iteration: number = 0;
    props;

    protected values;

    initialize (pattern: Partial<SerializedActivePattern> = {}) {
        this.id = pattern.id || makeId();

        // If no props are provided, use the default props
        this.props = pattern.props
            ? this.deserializeProps(pattern.props)
            : this.getClass().defaultProps();

        if (pattern.iteration) this.iteration = pattern.iteration;
        if (pattern.state) {
            this.deserializeState(pattern.state);
        } else {
            this.initializeState();
        }

        return this;
    }

    // Patterns are typically produced assuming they will be run on a canopy with 96 strips
    // of 75 LEDs each. Sometimes this isn't true, however. This function will scale the point from
    // the standard-sized canopy to whatever is given.
    static convertCoordinate (point, canopy) {
        const { strip, led } = point;

        const canopyStrip = Math.round(
            util.scale(strip, 0, NUM_STRIPS - 1, 0, canopy.strips.length - 1)
        );

        const canopyLed = Math.round(
            util.scale(led, 0, NUM_LEDS_PER_STRIP - 1, 0, canopy.stripLength - 1)
        );

        return { strip: canopyStrip, led: canopyLed };
    }

    /**
     * I really have no idea how to do this better. Given a pattern class instance, we
     * will want to access its static class attributes. In vanilla JS, we do this via
     * `this.constructor`, but TypeScript doesn't seem to provide a way to say "this
     * interface's constructor is of this type", so accessing `this.constructor` directly
     * throws a type error. Casting directly to `PatternStaticProperties` also throws a
     * type error (ts2352) as TS doesn't think the `PatternStaticProperties` and the generic
     * `Function` type (which is assigned to `this.constructor`) overlap sufficiently. So
     * first we cast to `unknown` to tell the compiler to forget what it thinks it knows,
     * then we cast to `PatternStaticProperties`.
     */
    getClass () {
        return <PatternStaticProperties>(<unknown>this.constructor);
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
            type: this.getClass().displayName,
            id: this.id,
            props,
            state: this.serializeState(),
            iteration: this.iteration
        };
    }

    // Should be overridden in inheriting classes if needed
    serializeState () { return {}; }
    deserializeState (state) {}
    initializeState () {}

    deserializeProps (props: object) {
        const parseProp = (propType, value) => {
            if (propType instanceof PatternPropTypes.Color) {
                if (isColor(value)) {
                    return RGB.fromObject(<RGB>value);
                } else {
                    return new ColorOscillator(value);
                }
            } else if (propType instanceof PatternPropTypes.Array) {
                return value.map(v => parseProp(propType.types, v));
            } else if (propType instanceof PatternPropTypes.Oscillator) {
                return new Oscillator(value);
            } else if (value.oscillator) {
                return new NumericOscillator(value);
            } else {
                return value;
            }
        };

        // Deserialize the props
        const deserialized = {};
        Object.entries(props).forEach(([name, value]) => {
            const propType = this.getClass().propTypes[name];
            deserialized[name] = parseProp(propType, value);
        });

        return deserialized;
    }

    deserialize (pattern: SerializedActivePattern) {
        this.updateProps(this.deserializeProps(pattern.props));
        this.deserializeState(pattern.state);
        this.iteration = pattern.iteration;
    }

    // These must each be implemented in inheriting classes
    abstract render (canopy: CanopyInterface): void;

    progress () {
        this.iteration++;

        // If any of the props are oscillators
        const values = {};
        Object.entries(this.props).forEach(([name, value]) => {
            if (isOscillatorWrapper(value)) {
                values[name] = value.value();
            } else {
                values[name] = value;
            }
        });

        this.values = values;
    }

    updateProps (props: PatternProps) {
        _.merge(this.props, props);
    }
}
