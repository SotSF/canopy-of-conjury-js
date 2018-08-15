import { CanopyInterface } from '../../types';


export interface IMemoizedMap {
    mapCoords (x: number, y: number) : any
}

export interface IMemoizer {
    createMap (canvasDimension: number, canopy: CanopyInterface) : IMemoizedMap
}
