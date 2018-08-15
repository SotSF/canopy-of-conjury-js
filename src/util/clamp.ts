/**
 * Clamp function which takes a value, a minimum and a maximum and returns...
 *
 *   - the minimum, if the value is less than the minimum
 *   - the maximum, if the value is greater than the maximum
 *   - otherwise, the value
 */

export default (value: number, min: number, max: number) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
};
