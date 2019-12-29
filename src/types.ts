
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

export type PatternProps = {};

export interface PatternStaticProperties {
    propTypes: object
    defaultProps: () => PatternProps
    displayName: string
}

export interface PatternInstance {
    id: string
    props: any
    getClass: () => PatternStaticProperties
    initialize: (pattern: Partial<SerializedActivePattern>) => void
    initializeState?: () => void
    progress: () => void
    updateProps: (props: PatternProps) => void
    render: (canopy: CanopyInterface) => void
    serialize: () => SerializedActivePattern
    serializeState?: () => object
    deserialize: (pattern: SerializedActivePattern) => void
    deserializeState?: (o: object) => void
    deserializeProps: (o: object) => PatternProps
}

// The serialized version of a pattern
export interface SerializedPattern {
    type: string
    props: PatternProps
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

export const pattern = () =>
    <U extends PatternStaticProperties>(constructor: U) => {constructor};
