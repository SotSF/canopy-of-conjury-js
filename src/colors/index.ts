
import * as _ from 'lodash';
import { Color } from './types';
import { hsvToRgb, rgbToHex, rgbToHexString, rgbToHsv } from './util';
import * as util from '../util';

export * from './types';
export * from './util';


export class RGB implements Color {
    r = null;
    g = null;
    b = null;
    a = null;

    // Randomly selects a hue for the color, but returns RGB
    static random () {
        return new HSV(Math.random(), 1, 1).toRgb();

    }

    static fromObject (obj: RGB): RGB {
        return new RGB(
            obj.r,
            obj.g,
            obj.b,
            obj.a
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

    toHsv () {
        const { h, s, v } = rgbToHsv(this);
        return new HSV(h, s, v);
    }

    /**
     * Converts the color to hexadecimal triplet notation, which is ThreeJS's preferred
     * representation. This is achieved by left-shifting the `r` value by 4, adding the `g` value
     * left-shifted by 2, and adding the `b` value unchanged. The shifting is done in base 16.
     */
    toHex () {
        return rgbToHex(this);
    }

    toString () {
        return rgbToHexString(this);
    }

    withAlpha (a) {
        return new RGB(this.r, this.g, this.b, a);
    }

    serialize () {
        return {
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a
        };
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

    toHsv () { 
        return this;
    }

    toString () {
        return this.toRgb().toString();
    }

    withAlpha (a) {
        return this.toRgb().withAlpha(a);
    }

    serialize () {
        return this.toRgb().serialize();
    }
}

export const BLACK = new RGB(0, 0, 0);

export const isColor = (maybeColor: any): maybeColor is Color => {
    const rgbProps = ['r', 'g', 'b', 'a'];
    const hsvProps = ['h', 's', 'v', 'a'];

    const hasColorProps = (colorProps) => _.every(
        colorProps.map(
            prop => Object.hasOwnProperty.call(maybeColor, prop)
        )
    );

    return hasColorProps(rgbProps) || hasColorProps(hsvProps);
};

/** Takes an array of colors and reduces them to a single color. Returns black if array is empty */
export const combine = (colors: RGB[]): RGB => {
    if (colors.length === 0) {
        return new RGB(0, 0, 0, 0);
    }

    let r = 0, g = 0, b = 0, a = 1;
    
    colors.forEach((color) => {
        r = util.lerp(r,color.r,color.a);
        g = util.lerp(g,color.g,color.a);
        b = util.lerp(b,color.b,color.a);
    });

    return new RGB(r, g, b, a);
};

