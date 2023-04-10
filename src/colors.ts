import _ from "lodash";
import * as util from "@/util";

export type Color = {
  toHex: () => number;
  toRgb: () => RGB;
  toString: () => string;
  withAlpha: (alpha: number) => Color;
  serialize: () => RGB.Serialized;
};

export namespace RGB {
  export type Serialized = {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

export class RGB implements Color {
  r: number;
  g: number;
  b: number;
  a: number;

  // Randomly selects a hue for the color, but returns RGB
  static random() {
    return new HSV(Math.random(), 1, 1).toRgb();
  }

  static fromObject(obj: RGB.Serialized): RGB {
    return new RGB(obj.r, obj.g, obj.b, obj.a);
  }

  constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toRgb() {
    return this;
  }

  /**
   * Converts an RGB color value to HSV. Conversion formula adapted from
   * http://en.wikipedia.org/wiki/HSV_color_space. Assumes r, g, and b are contained in the set
   * [0, 255] and returns h, s, and v in the set [0, 1].
   */
  toHsv() {
    let { r, g, b } = this;
    (r /= 255), (g /= 255), (b /= 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const h = (() => {
      // achromatic
      if (max == min) return 0;
      return (
        (max === r
          ? (g - b) / d + (g < b ? 6 : 0)
          : max === g
          ? (b - r) / d + 2
          : (r - g) / d + 4) / 6
      );
    })();

    return new HSV(h, max == 0 ? 0 : d / max, max);
  }

  /**
   * Converts the color to hexadecimal triplet notation, which is ThreeJS's preferred
   * representation. This is achieved by left-shifting the `r` value by 4, adding the `g` value
   * left-shifted by 2, and adding the `b` value unchanged. The shifting is done in base 16.
   */
  toHex() {
    const { r, g, b } = this;
    return r * 16 ** 4 + g * 16 ** 2 + b;
  }

  toString() {
    const { r, g, b } = this;
    const rHex = convertIntToHex(r);
    const gHex = convertIntToHex(g);
    const bHex = convertIntToHex(b);

    return `#${rHex}${gHex}${bHex}`;
  }

  withAlpha(a: number) {
    return new RGB(this.r, this.g, this.b, a);
  }

  serialize() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a,
    };
  }
}

export class HSV implements Color {
  h: number;
  s: number;
  v: number;

  constructor(h: number, s: number, v: number) {
    this.h = h;
    this.s = s;
    this.v = v;
  }

  /**
   * Converts the color to hexadecimal triplet notation, which is ThreeJS's preferred
   * representation. This is achieved by left-shifting the `r` value by 4, adding the `g` value
   * left-shifted by 2, and adding the `b` value unchanged. The shifting is done in base 16.
   */
  toHex() {
    return this.toRgb().toHex();
  }

  /**
   * Converts an HSV color value to RGB. Conversion formula adapted from
   * http://en.wikipedia.org/wiki/HSV_color_space. Assumes h, s, and v are contained in the set
   * [0, 1] and returns r, g, and b in the set [0, 255].
   */
  toRgb() {
    const { h, s, v } = this;
    let r, g, b;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
      default:
        // This is mathematically impossible
        throw new Error();
    }

    return new RGB(r * 255, g * 255, b * 255, 1);
  }

  toHsv() {
    return this;
  }

  toString() {
    return this.toRgb().toString();
  }

  withAlpha(a: number) {
    return this.toRgb().withAlpha(a);
  }

  serialize() {
    return this.toRgb().serialize();
  }
}

export const BLACK = new RGB(0, 0, 0);

export const isColor = (maybeColor: any): maybeColor is Color => {
  const rgbProps = ["r", "g", "b", "a"];
  const hsvProps = ["h", "s", "v", "a"];

  const hasColorProps = (colorProps: string[]) =>
    _.every(
      colorProps.map((prop) => Object.hasOwnProperty.call(maybeColor, prop))
    );

  return hasColorProps(rgbProps) || hasColorProps(hsvProps);
};

/** Takes an array of colors and reduces them to a single color. Returns black if array is empty */
export const combine = (colors: RGB.Serialized[]): RGB => {
  if (colors.length === 0) {
    return new RGB(0, 0, 0, 0);
  }

  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  colors.forEach((color) => {
    r = util.lerp(r, color.r, color.a);
    g = util.lerp(g, color.g, color.a);
    b = util.lerp(b, color.b, color.a);
  });

  return new RGB(r, g, b, a);
};

/** Given an integer in the range [0, 255], this will return the hex string */
const convertIntToHex = (int: number) => {
  const hexAlphabet = "0123456789ABCDEF";
  const quotient = Math.floor(int / 16);
  const remainder = Math.floor(int % 16);

  return `${hexAlphabet[quotient]}${hexAlphabet[remainder]}`;
};
