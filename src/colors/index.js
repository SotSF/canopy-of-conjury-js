
import { rgbToHex, rgbToHsv } from './util';

export * from './util';
export const pColor = new Processing(document.getElementById('idCanvas'), (processing) => {
    processing.setup = () => {
        processing.size(1,1);
    }
});

export class RGB {
    constructor (r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;

        this.a = (arguments.length == 4) ? a : 1;
    }

    /**
     * Converts the color to hexadecimal triplet notation, which is ThreeJS's preferred
     * representation. This is achieved by left-shifting the `r` value by 4, adding the `g` value
     * left-shifted by 2, and adding the `b` value unchanged. The shifting is done in base 16.
     */
    toHex () {
        return rgbToHex({ r: this.r, g: this.g, b: this.b });
    }

    toHSV () {
        return rgbToHsv({r: this.r, g: this.g, b: this.b});
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
        return hsvToRgb({h:this.h, s:this.s, v:this.v});
    }
}
