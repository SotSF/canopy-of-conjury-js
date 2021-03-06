
import { CanopyInterface } from '../../types';
import { IMemoizedMap, IMemoizer } from './types';


class MemoizedMap implements IMemoizedMap {
    map = {};

    constructor (canvasSize: number, canopy: CanopyInterface) {
        this.memoize(canvasSize, canopy);
    }

    /**
     * Looks up the memoized mapping from coordinate (x,y) where xE[0,canvasSize] and
     * yE[0,canvasSize] to the strip and LED that correspond
     */
    mapCoords (x, y) {
        return this.map[`${x}.${y}`];
    }

    private memoize (canvasSize: number, canopy: CanopyInterface) {
        const numStrips = canopy.strips.length;
        const numLedsPerStrip = canopy.strips[0].length;

        // Compute the constant to scale the magnitude of the pixel radius
        const halfCanvas = canvasSize / 2;
        const scaleFactor = numLedsPerStrip / halfCanvas;

        // Maps a single pixel in the canvas to the strip and LED in the canopy
        const mapToCanopy = (x, y) => {
            const TWO_PI = Math.PI * 2;

            let theta = Math.atan2(y, x);
            if (theta < 0) {
                theta += TWO_PI
            }

            const radius = Math.sqrt(x ** 2 + y ** 2) * scaleFactor;

            return {
                strip: Math.floor(theta * numStrips / TWO_PI),
                led: Math.round(radius)
            };
        };

        for (let x = 0; x <= canvasSize; x++) {
            for (let y = 0; y <= canvasSize; y++) {
                this.map[`${x}.${y}`] = mapToCanopy(x - halfCanvas, y - halfCanvas);
            }
        }
    }
}

/**
 * When converting canvas coordinates to canopy coordinates (basically a mapping from cartesian to
 * polar) it helps to have the pixel-to-led mapping pre-computed. This memoizer assists in the rapid
 * conversion between pattern spaces.
 */
export default class Memoizer implements IMemoizer {
    maps = {};

    createMap (canvasSize: number, canopy: CanopyInterface) {
        const numStrips = canopy.strips.length;
        const mapKey = `${numStrips}.${canopy.stripLength}`;

        // If we have already created a map of this size, don't do it again
        if (Object.hasOwnProperty.call(this.maps, mapKey)) {
            return this.maps[mapKey];
        }

        // Otherwise, time to make a new one
        return this.maps[mapKey] = new MemoizedMap(canvasSize, canopy);
    }
}
