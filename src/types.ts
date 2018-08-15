
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
    serialize: () => object
    deserialize: (object) => void
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

export interface IOscillator {
    readonly params: IWaveParams
    scaled: (min: number, max: number) => number
    theta: number
    updateWave: (params: { amplitude?: number, frequency?: number, type?: WaveType }) => void
    value: number
    waveFunction: (x: number) => number
}

export type AccessibleProp<T> = T | (() => T);
