
export interface EnumType {
    values () : string[]
    value (index: number) : string
    index (value: string) : number
}

export interface LedInterface {
    r: number,
    b: number,
    g: number
}

export interface StripInterface {
    leds: LedInterface[],
    length: number,
    updateColor (position: number, color: string): void
    updateColors (color: string): void
}

export interface CanopyInterface {
    strips: StripInterface[]
    stripLength: number
}

export interface PatternInstance {
    props: any,
    progress () : void,
    updateProps (o: object) : void,
    render (canopy: CanopyInterface) : void
}

/** Crazy trickery... see https://stackoverflow.com/questions/13955157/how-to-define-static-property-in-typescript-interface */
export interface PatternInterface {
    new(o?: any): PatternInstance,
    propTypes: object,
    defaultProps (): object
}

export const pattern = () => (contsructor: PatternInterface) => {};

/** Oscillators */
export interface IOscillator {
    waveFunction: (x: number) => number,
    theta: number
    value: number
    scaled: (min: number, max: number) => number
    subscribe: (fn: (value: number) => void) => string
    unsubscribe: (token: string) => void
}

export type AccessibleProp<T> = T | (() => T);
