
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
        const r = this.r * (16 ** 4);
        const g = this.g * (16 ** 2);
        const b = this.b;

        return r + g + b;
    }
}
