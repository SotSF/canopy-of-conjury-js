
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
    leds: LedInterface[]
    length: number
    updateColor: (position: number, color: Color) => void
    updateColors: (color: Color) => void
}

export interface CanopyInterface {
    strips: StripInterface[]
    stripLength: number
}

export interface PatternInstance {
    props: any
    progress: () => void
    updateProps: (o: object) => void
    render: (canopy: CanopyInterface) => void
    serialize: () => IPatternState
    deserialize: (state: IPatternState) => void
    serializeExtra?: () => object
    deserializeExtra?: (object) => void
}

export interface IPatternActive {
    id: string
    order: number
    instance: PatternInstance
    name: string
}

// The serialized version of a pattern
export interface IPatternState {
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

export interface IOscillator<T> {
    readonly params: IWaveParams
    scaled: (min: number, max: number) => number
    theta: number
    updateWave: (params: { amplitude?: number, frequency?: number, type?: WaveType }) => void
    value: T
    waveFunction: (x: number) => T
    serialize: () => ISerializedOscillator
}

export type MaybeOscillator<T> = T | IOscillator<T>;
