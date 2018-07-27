
export interface LedInterface {
    r: number,
    b: number,
    g: number
}

export interface StripInterface {
    leds: LedInterface[]
    updateColor (position: number, color: string): void
}

export interface CanopyInterface {
    strips: StripInterface[]
}

export enum PatternPropType {
    Color,
    Range
}

export interface PatternInstance {
    update (o?: object) : void,
    render (canopy: CanopyInterface) : void
}

/** Crazy trickery... see https://stackoverflow.com/questions/13955157/how-to-define-static-property-in-typescript-interface */
export interface PatternInterface {
    new(): PatternInstance,
    propTypes: object,
    defaultProps (): object
}

export const pattern = () => (contsructor: PatternInterface) => {};
