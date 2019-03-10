
/**
 * Samples a Gaussian distribution using the Box-Muller transform. See
 * 
 *   https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
 * 
 * for an explanation, and
 * 
 *   https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
 * 
 * for the implementation
 */
export const sampleGaussian = () => {
    let u = 0, v = 0;

    // Converts [0,1) to (0,1)
    while (u === 0) u = Math.random(); 
    while (v === 0) v = Math.random();

    let num = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

    // Translate to 0 -> 1
    num = num / 10.0 + 0.5;

    // If the number is out of range (unlikely but possible), re-sample
    return num > 1 || num < 0 ? sampleGaussian() : num;
};
