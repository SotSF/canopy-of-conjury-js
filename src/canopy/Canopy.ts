
import * as _ from 'lodash';
import { RGB } from '../colors';
import { CanopyInterface, StripInterface } from '../types';


class Strip implements StripInterface {
    leds = null;

    constructor (numLedsPerStrip) {
        this.leds = _.range(numLedsPerStrip).map(() => new RGB(0, 0, 0));
    }

    get length () {
        return this.leds.length;
    }

    updateColor (index, color) {
        this.leds[index] = color;
    }

    updateColors(color) {
        _.range(this.leds.length).forEach(i => this.updateColor(i, color));
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
