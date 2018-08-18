/**
 * Clamp function which takes a value, a minimum and a maximum and returns the value modulated to be
 * within the range [min, max]
 */

export default (value: number, min: number, max: number) => {
    const width = max - min;

    if (value < min) {
        const quotient = Math.ceil((min - value) / width);
        return value + quotient * width;
    }

    if (value > max) {
        const quotient = Math.ceil((value - max) / width);
        return value - quotient * width;
    }

    return value;
};
