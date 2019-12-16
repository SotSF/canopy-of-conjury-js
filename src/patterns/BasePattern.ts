
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB, isColor } from '../colors';
import { CanopyInterface, PatternInstance, PatternInterface, SerializedActivePattern } from '../types';
import * as util from '../util';
import { isOscillatorWrapper, Oscillator, OscillatorWrapper, PatternPropTypes } from './utils';


// Creates a unique ID for a pattern instance
const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const makeId = () => _.range(20).map(() => _.sample(characters)).join('');

export default abstract class BasePattern implements PatternInstance {
    id = null;
    props = null;
    values = null;
    iteration = 0;

    initialize (pattern: Partial<SerializedActivePattern> = {}) {
        this.id = pattern.id || makeId();

        // If no props are provided, use the default props
        this.props = pattern.props
            ? this.deserializeProps(pattern.props)
            // @ts-ignore: I don't know how to teach typescript that class will have the static property
            : this.constructor.defaultProps();

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
        this.values = {};
        Object.entries(this.props).forEach(([name, value]) => {
            if (isOscillatorWrapper(value)) {
                this.values[name] = value.value();
            } else {
                this. values[name] = value;
            }
        });
    }

    updateProps (props) {
        _.merge(this.props, props);
    }
}
