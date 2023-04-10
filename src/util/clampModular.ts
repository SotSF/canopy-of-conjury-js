/**
 * Clamp function which takes a value, a minimum and a maximum and returns the value modulated to be
 * within the range [min, max)
 */

export function clampModular(value: number, min: number, max: number) {
  const width = max - min;

  if (value < min) {
    const quotient = Math.ceil((min - value) / width);
    return value + quotient * width;
  }

  let valInRange = value;
  if (value > max) {
    const quotient = Math.ceil((value - max) / width);
    valInRange = value - quotient * width;
  }

  return valInRange === max ? min : valInRange;
}
