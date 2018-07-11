
export const rgbToHex = ({ r, g, b }) => (
    r * (16 ** 4) +
    g * (16 ** 2) +
    b
);


/** Given an integer in the range [0, 255], this will return the hex string */
const convertIntToHex = (int) => {
    const hexAlphabet = '0123456789ABCDEF';
    const quotient = Math.floor(int / 16);
    const remainder = int % 16;

    return `${hexAlphabet[quotient]}${hexAlphabet[remainder]}`;
};

/** Given an RGB object, this will return the corresponding hex triplet */
export const rgbToHexString = ({ r, g, b }) => {
    const rHex = convertIntToHex(r);
    const gHex = convertIntToHex(g);
    const bHex = convertIntToHex(b);

	return `#${rHex}${gHex}${bHex}`;
};
