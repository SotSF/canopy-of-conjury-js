
import * as _ from 'lodash';
import { RGB } from '../colors';
import { CanopyInterface, StripInterface } from '../types';


class Strip implements StripInterface {
    leds = null;

    constructor (numLedsPerStrip) {
        this.leds = _.range(numLedsPerStrip).map(() => []);
    }

    get length () {
        return this.leds.length;
    }

    updateColor (index, color) {
        this.leds[index].push(color.toRgb().withAlpha(0.02));
    }

    updateColors(color) {
        _.range(this.leds.length).forEach(i => this.updateColor(i, color));
    }

    clear () {
        for (let i = 0; i < this.leds.length; i++) {
            this.leds[i] = [];
        }
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

    clear () {
        this.strips.forEach(strip => strip.clear());
    }
}
