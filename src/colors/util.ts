
import { HSV, RGB } from './types';


export const rgbToHex = ({ r, g, b }: RGB) => (
    r * (16 ** 4) +
    g * (16 ** 2) +
    b
);


/** Given an integer in the range [0, 255], this will return the hex string */
const convertIntToHex = (int: number) => {
    const hexAlphabet = '0123456789ABCDEF';
    const quotient = Math.floor(int / 16);
    const remainder = Math.floor(int % 16);

    return `${hexAlphabet[quotient]}${hexAlphabet[remainder]}`;
};

/** Given an RGB object, this will return the corresponding hex triplet */
export const rgbToHexString = ({ r, g, b }: RGB) => {
    const rHex = convertIntToHex(r);
    const gHex = convertIntToHex(g);
    const bHex = convertIntToHex(b);

    return `#${rHex}${gHex}${bHex}`;
};

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 */
export const rgbToHsv = ({ r, g, b }: RGB): HSV => {
    r /= 255, g /= 255, b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h, s, v };
};

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 */
export const hsvToRgb = ({ h, s, v }: HSV): RGB => {
    let r, g, b;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
};
