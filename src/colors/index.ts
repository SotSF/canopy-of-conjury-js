
import { Color } from './types';
import { hsvToRgb, rgbToHex } from './util';


export * from './types';
export * from './util';

export class RGB implements Color {
    r = null;
    g = null;
    b = null;

    constructor (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toRgb () {
        return this;
    }

    /**
     * Converts the color to hexadecimal triplet notation, which is ThreeJS's preferred
     * representation. This is achieved by left-shifting the `r` value by 4, adding the `g` value
     * left-shifted by 2, and adding the `b` value unchanged. The shifting is done in base 16.
     */
    toHex () {
        return rgbToHex(this.toRgb());
    }
}


export class HSV implements Color {
    h = null;
    s = null;
    v = null;

    constructor (h, s, v) {
        this.h = h;
        this.s = s;
        this.v = v;
    }

    /**
     * Converts the color to hexadecimal triplet notation, which is ThreeJS's preferred
     * representation. This is achieved by left-shifting the `r` value by 4, adding the `g` value
     * left-shifted by 2, and adding the `b` value unchanged. The shifting is done in base 16.
     */
    toHex () {
        return rgbToHex(this.toRgb());
    }

    toRgb () {
        return hsvToRgb(this);
    }
}
