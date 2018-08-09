
import { Color } from './types';
import { hsvToRgb, rgbToHex, rgbToHexString, rgbToHsv } from './util';

export * from './types';
export * from './util';


export class RGB implements Color {
    r = null;
    g = null;
    b = null;
    a = null;

    static random () {
        return new RGB(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        );
    }

    constructor (r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toRgb () {
        return this;
    }

    toHSV () {
        const { h, s, v } = rgbToHsv(this);
        return new HSV(h, s, v);
    }

    /**
     * Converts the color to hexadecimal triplet notation, which is ThreeJS's preferred
     * representation. This is achieved by left-shifting the `r` value by 4, adding the `g` value
     * left-shifted by 2, and adding the `b` value unchanged. The shifting is done in base 16.
     */
    toHex () {
        return rgbToHex(this.toRgb());
    }

    toString () {
        return rgbToHexString(this.toRgb());
    }

    withAlpha (a) {
        return new RGB(this.r, this.g, this.b, a);
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
        return this.toRgb().toHex();
    }

    toRgb () {
        const { r, g, b } = hsvToRgb(this);
        return new RGB(r, g, b);
    }

    toString () {
        return this.toRgb().toString();
    }
}

export const BLACK = new RGB(0, 0, 0);
