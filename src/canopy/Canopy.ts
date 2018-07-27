
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

    updateColor (index, color) {
        this.leds[index] = color;
    }
}

export default class Canopy implements CanopyInterface {
    strips = null;

    constructor (numStrips, numLedsPerStrip) {
        this.strips = _.range(numStrips).map(() => new Strip(numLedsPerStrip));
    }
}
