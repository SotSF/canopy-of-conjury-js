/**
 * Re-maps a number from one range to another. Numbers outside the range are not clamped to 0 and 1,
 * because out-of- range values are often intentional and useful.
 *
 * @param {float} value        The incoming value to be converted
 * @param {float} istart       Lower bound of the value's current range
 * @param {float} istop        Upper bound of the value's current range
 * @param {float} ostart       Lower bound of the value's target range
 * @param {float} ostop        Upper bound of the value's target range
 *
 * @returns {float}
 */
export function scale(
  value: number,
  istart: number,
  istop: number,
  ostart: number,
  ostop: number
) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}
