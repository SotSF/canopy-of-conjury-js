
import * as _ from 'lodash';
import { CanopyInterface, StripInterface } from '../types';

class Strip implements StripInterface {
    leds = null;

    constructor (numLedsPerStrip) {
        this.leds = _.range(numLedsPerStrip).map(() => ({
            r: null,
            g: null,
            b: null
        }));
    }

    get length () {
        return this.leds.length;
    }

    updateColor (index, color) {
        this.leds[index] = color;
    }
}

export default class Canopy implements CanopyInterface {
    strips = null;

    constructor (numStrips, numLedsPerStrip) {
        this.strips = _.range(numStrips).map(() => new Strip(numLedsPerStrip));
    }

    get stripLength () {
        return this.strips[0].length;
    }
}
