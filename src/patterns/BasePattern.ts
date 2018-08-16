
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { CanopyInterface, PatternInstance } from '../types';
import * as util from '../util';
import Oscillator from './utils/oscillator';


export default abstract class BasePattern implements PatternInstance {
    props = null;
    iteration = 0;

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
            if (Object.hasOwnProperty.call(value, 'serialize')) {
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
            props,
            ...this.serializeExtra()
        };
    }

    // Should be overridden in inheriting classes if they have any additional parameters that must
    // be serialized
    serializeExtra () {
        return {};
    }

    deserialize (obj) {
        // Deserialize the props
        const props = {};
        Object.entries(obj.props).forEach(([name, value]) => {

        });
    }

    // These must each be implemented in inheriting classes
    abstract render (canopy: CanopyInterface);

    constructor (props) {
        // If no props are provided, use the default props
        // @ts-ignore: I don't know how to teach typescript that class will have the static property
        this.props = props || this.constructor.defaultProps();
    }

    progress () {
        this.iteration++;
    }

    updateProps (props) {
        _.merge(this.props, props);
    }

    /**
     * Given the name of a prop that may be an oscillator, this function will look up the prop,
     * check if it's an oscillator and return the oscillator value if it is. If the prop is not an
     * oscillator, the prop will be returned as is.
     */
    getOscillatorValue (propName) {
        const prop = this.props[propName];
        if (prop instanceof Oscillator) {
            return prop.value;
        } else {
            return prop;
        }
    }
}
