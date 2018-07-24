
export interface Strip {

}

export interface Canopy {
    strips: Strip[]
}

export interface Pattern {
    update: () => void,
    render: (Canopy) => void
}
