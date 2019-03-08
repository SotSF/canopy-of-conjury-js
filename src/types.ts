
import { Color } from './colors';


export interface EnumType {
    values: () => string[]
    value: (index: number) => string
    index: (value: string) => number
}

export interface LedInterface {
    r: number
    b: number
    g: number
}

export interface StripInterface {
    clear: () => void
    leds: LedInterface[][]
    length: number
    updateColor: (position: number, color: Color) => void
    updateColors: (color: Color) => void
}

export interface GridInterface {
    clear: () => void
    strips: StripInterface[]
    numRows: number
    numCols: number
}

export interface PatternInstance {
    props: any
    progress: () => void
    updateProps: (o: object) => void
    render: (grid: GridInterface) => void
    serialize: () => IPatternState
    serializeExtra?: () => object
    deserialize: (state: IPatternState) => void
    deserializeExtra?: (o: object) => void
    deserializeProps: (o: object) => object
}

export interface IPatternActive {
    id: string
    order: number
    instance: PatternInstance
    name: string
}

// The serialized version of a pattern
export interface IPatternState {
    type: string
    props: object
    extra: object
    iteration: number
}

/** Crazy trickery... see https://stackoverflow.com/questions/13955157/how-to-define-static-property-in-typescript-interface */
export interface PatternInterface {
    new(o?: any): PatternInstance
    propTypes: object
    defaultProps: () => object
    displayName: string
}

export const pattern = () => (contsructor: PatternInterface) => {};

/** Oscillators */
export enum WaveType {
    'Sine',
    'Square',
    'Triangle',
    'Saw'
}

export interface IWaveParams {
    amplitude: number
    frequency: number
    type: WaveType
}

export interface ISerializedOscillator extends IWaveParams {
    theta: number
}

export interface IOscillator {
    readonly params: IWaveParams
    theta: number
    updateWave: (params: { amplitude?: number, frequency?: number, type?: WaveType }) => void
    sample: number
    waveFunction: (x: number) => number
    serialize: () => ISerializedOscillator
}

export interface IOscillatorWrapper {
    type: string
    oscillator: IOscillator
    value: () => any
    serialize: () => ISerializedOscillatorWrapper
}

export interface ISerializedOscillatorWrapper {
    oscillator: ISerializedOscillator
    type: string
}

export interface INumericOscillator extends IOscillatorWrapper {
    value: () => number
}

export interface IColorOscillator extends IOscillatorWrapper {
    value: () => Color
}

export type MaybeOscillator<T> = T | IOscillatorWrapper;
