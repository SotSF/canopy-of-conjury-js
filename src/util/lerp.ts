/**
 * Basic linear interpolation. Calculates a number between two numbers at a specific increment. The
 * amt  parameter is the amount to interpolate between the two values where 0.0 equal to the first
 * point, 0.1 is very near the first point, 0.5 is half-way in between, etc. The lerp function is
 * convenient for creating motion along a straight path and for drawing dotted lines.
 *
 * Taken verbatim from processing.js
 *
 * @param {int|float} value1       float or int: first value
 * @param {int|float} value2       float or int: second value
 * @param {int|float} amt          float: between 0.0 and 1.0
 *
 * @returns {float}
 */
export function lerp(value1: number, value2: number, amt: number) {
  return (value2 - value1) * amt + value1;
}
