// all osc between -1 and 1
export const sine = () => (freq, pha, t) => Math.sin(2 * Math.PI * freq * t + 2 * Math.PI * pha);

export const saw = () => (freq, pha, t) => {
  return Math.abs(t * 2 * freq + pha) % 2 - 1
};

export const pulse = (width) => (freq, pha, t) => {
  const cutoff = 1 - 2 * width;
  return saw()(freq, pha, t) > cutoff ? 1 : -1
};
