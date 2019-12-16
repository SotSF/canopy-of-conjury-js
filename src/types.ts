
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

export interface CanopyInterface {
    clear: () => void
    strips: StripInterface[]
    stripLength: number
}

export interface PatternInstance {
    id: string
    props: any
    initialize: (pattern: Partial<SerializedActivePattern>) => void
    initializeState?: () => void
    progress: () => void
    updateProps: (o: object) => void
    render: (canopy: CanopyInterface) => void
    serialize: () => SerializedActivePattern
    serializeState?: () => object
    deserialize: (pattern: SerializedActivePattern) => void
    deserializeState?: (o: object) => void
    deserializeProps: (o: object) => object
}

// The serialized version of a pattern
export interface SerializedPattern {
    type: string
    props: object
    state: object
}

export interface SerializedActivePattern extends SerializedPattern {
    iteration: number
    id: string
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
