
export interface HSV {
    h: number
    s: number
    v: number
    a?: number
}

export interface RGB {
    r: number
    g: number
    b: number
    a: number
}

export interface Color {
    toHex: () => number
    toRgb: () => RGB
    toString: () => string
    withAlpha: (alpha: number) => Color
    serialize: () => RGB
}
