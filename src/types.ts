import { Color } from "@/colors";
import { PatternPropTypes as PropTypes } from "@/patterns/utils";

export type Enumeration = Record<string, number> & Record<number, string>;
export type EnumType = {
  values: () => string[];
  value: (index: number) => string;
  index: (value: string) => number;
};

export type LedInterface = {
  r: number;
  b: number;
  g: number;
  a: number;
};

export type StripInterface = {
  clear: () => void;
  leds: LedInterface[][];
  length: number;
  updateColor: (position: number, color: Color) => void;
  updateColors: (color: Color) => void;
};

export type CanopyCoordinate = { strip: number; led: number };
export type CanopyInterface = {
  clear: () => void;
  strips: StripInterface[];
  stripLength: number;
};

export type PatternInstance = {
  constructor: PatternInterface;
  props: any;
  progress: () => void;
  updateProps: (o: PropSet) => void;
  render: (canopy: CanopyInterface) => void;
  serialize: () => IPatternState;
  serializeExtra?: () => object;
  deserialize: (state: IPatternState) => void;
  deserializeExtra?: (o: object) => void;
  deserializeProps: (o: object) => PropSet;
};

export type IPatternActive = {
  id: string;
  order: number;
  instance: PatternInstance;
  name: string;
};

// The serialized version of a pattern
export type IPatternState = {
  type: string;
  props: object;
  extra: object;
  iteration: number;
};

/** Crazy trickery... see https://stackoverflow.com/questions/13955157/how-to-define-static-property-in-typescript-interface */
export type PatternInterface = {
  new (o?: any): PatternInstance;
  propTypes: Record<string, PropType>;
  defaultProps: () => object;
  displayName: string;
};

export type PropType =
  | PropTypes.Color
  | PropTypes.Enum
  | PropTypes.Range
  | PropTypes.Boolean
  | PropTypes.Array
  | PropTypes.Oscillator;

type PropValue = any;
export type PropSet = { [s: string]: PropValue };

/** Oscillators */
export enum WaveType {
  "Sine",
  "Square",
  "Triangle",
  "Saw",
}

export type IWaveParams = {
  amplitude: number;
  frequency: number;
  type: WaveType;
};

export type ISerializedOscillator = IWaveParams & {
  theta: number;
};

export type IOscillator = {
  readonly params: IWaveParams;
  theta: number;
  updateWave: (params: Partial<IWaveParams>) => void;
  sample: number;
  waveFunction: (x: number) => number;
  serialize: () => ISerializedOscillator;
};

export type IOscillatorWrapper = {
  type: string;
  oscillator: IOscillator;
  value: () => any;
  serialize: () => ISerializedOscillatorWrapper;
};

export type ISerializedOscillatorWrapper = {
  oscillator: ISerializedOscillator;
  type: string;
  min: number;
  max: number;
};

export type INumericOscillator = IOscillatorWrapper & {
  value: () => number;
};

export type IColorOscillator = IOscillatorWrapper & {
  value: () => Color;
};

export type MaybeOscillator<T> = T | IOscillatorWrapper;
