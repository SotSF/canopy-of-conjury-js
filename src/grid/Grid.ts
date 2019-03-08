
import * as _ from 'lodash';
import { GridInterface, StripInterface } from '../types';


class Strip implements StripInterface {
    leds = null;

    constructor (numLedsPerStrip) {
        this.leds = _.range(numLedsPerStrip).map(() => []);
    }

    get length () {
        return this.leds.length;
    }

    updateColor (index, color) {
        this.leds[index].push(color.toRgb());
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

export default class Grid implements GridInterface {
    strips = null;
    numRows = null;
    numCols = null;

    constructor (numRows, numCols) {
        this.strips = _.range(numCols).map(() => new Strip(numRows));
        this.numRows = numRows;
        this.numCols = numCols;
    }

    clear () {
        this.strips.forEach(strip => strip.clear());
    }
}
