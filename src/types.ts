
export interface LedInterface {
    r: number,
    b: number,
    g: number
}

export interface StripInterface {
    leds: LedInterface[]
    updateColor: (position: number, color: string) => void
}

export interface CanopyInterface {
    strips: StripInterface[]
}

export interface PatternInterface {
    update: () => void,
    render: (canopy: CanopyInterface) => void
}
