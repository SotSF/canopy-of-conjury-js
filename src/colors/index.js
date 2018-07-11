
import { rgbToHex } from './util';


export * from './util';

export class RGB {
    constructor (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * Converts the color to hexadecimal triplet notation, which is ThreeJS's preferred
     * representation. This is achieved by left-shifting the `r` value by 4, adding the `g` value
     * left-shifted by 2, and adding the `b` value unchanged. The shifting is done in base 16.
     */
    toHex () {
        return rgbToHex({ r: this.r, g: this.g, b: this.b });
    }
}


export class HSV {
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
        const i = Math.floor(this.h * 6);
        const f = this.h * 6 - i;
        const p = this.v * (1 - this.s);
        const q = this.v * (1 - f * this.s);
        const t = this.v * (1 - (1 - f) * this.s);

        let r = 0;
        let g = 0;
        let b = 0;

        switch (i % 6) {
            case 0:
                r = this.v;
                g = t;
                b = p;
                break;

            case 1:
                r = q;
                g = this.v;
                b = p;
                break;

            case 2:
                r = p;
                g = this.v;
                b = t;
                break;

            case 3:
                r = p;
                g = q;
                b = this.v;
                break;

            case 4:
                r = t;
                g = p;
                b = this.v;
                break;

            case 5:
                r = this.v;
                g = p;
                b = q;
                break;
        }

        return {
            r: r * 255,
            g: g * 255,
            b: b * 255
        };
    }
}
