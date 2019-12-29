import { Color } from "../../../colors";

export enum WaveType {
  'Sine',
  'Square',
  'Triangle',
  'Saw'
}

export interface WaveState {
  amplitude: number
  frequency: number
  type: WaveType
  theta: number
}

export interface IOscillator {
  updateWave: (state: Partial<WaveState>) => void
  state: WaveState
  sample: number
  sampleN: (n: number) => number[]
  waveFunction: (x: number) => number
  serialize: () => WaveState
}

export type OscillatorType = 'numeric' | 'color';
export type OscillatorGenericTypes = number | Color;

export interface IOscillatorWrapper<T extends OscillatorGenericTypes> {
  type: OscillatorType
  oscillator: IOscillator
  value: () => T
  serialize: () => object
}

interface SerializedOscillatorCommon {
  oscillatorState: Partial<WaveState>
}

export interface SerializedNumericOscillator extends SerializedOscillatorCommon {
  oscillatorType: 'numeric'  
  min: number
  max: number
}

export interface SerializedColorOscillator extends SerializedOscillatorCommon {
  oscillatorType: 'color'
}

export type MaybeOscillator<T extends OscillatorGenericTypes> = T | IOscillatorWrapper<T>;
