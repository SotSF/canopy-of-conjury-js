
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { CanopyInterface, PatternInstance } from '../types';
import * as util from '../util';
import { PCanvas } from './canvas';


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
}

export abstract class BaseProcessingPattern extends BasePattern {
    canvas = null;

    constructor (props) {
        super(props);
        this.canvas = new PCanvas();
    }
}
