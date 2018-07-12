
export const rgbToHex = ({ r, g, b }) => (
    r * (16 ** 4) +
    g * (16 ** 2) +
    b
);

export const hexToRgb = (hexString) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/** Given an integer in the range [0, 255], this will return the hex string */
const convertIntToHex = (int) => {
    const hexAlphabet = '0123456789ABCDEF';
    const quotient = Math.floor(int / 16);
    const remainder = int % 16;

    return `${hexAlphabet[quotient]}${hexAlphabet[remainder]}`;
};

/** Given an RGB object, this will return the corresponding hex triplet */
export const rgbToHexString = ({ r, g, b }) => {
    const rHex = convertIntToHex(parseInt(r));
    const gHex = convertIntToHex(parseInt(g));
    const bHex = convertIntToHex(parseInt(b));

	return `#${rHex}${gHex}${bHex}`;
};

/* RGB 255 to HSV 100 */
export const rgbToHsv = ({r, g, b}) => {
    r /= 255, g /= 255, b /= 255;
    
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
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
}

const hexToHsv = (hexString) => {
    return rgbToHsv(hexToRgb(hexString));
}

const hsvToHex = ({h,s,v}) => {
    return rgbToHex(hsvToRgb({h,s,v}));
}

export const hsvToRgb = ({h,s,v}) => {
    const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        let r = 0;
        let g = 0;
        let b = 0;

        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;

            case 1:
                r = q;
                g = v;
                b = p;
                break;

            case 2:
                r = p;
                g = v;
                b = t;
                break;

            case 3:
                r = p;
                g = q;
                b = v;
                break;

            case 4:
                r = t;
                g = p;
                b = v;
                break;

            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
}

export const modifyBrightness = (b, hex) => {
    let hsv = hexToHsv(hex); 
    hsv.v *= b / 100;
    return hsvToHex(hsv);
}