
import { RGB } from '../../colors';
import Memoizer from './memoizer';
import { RGB } from '../../colors';


/**
 * HTML5 canvas, and thus Processing canvas, loses alpha values, so we need to preserve original
 * color information to preserve transparency
 */
class AlphaMap {
    map = {};
    add = (key, value) => { this.map[key] = value; };
    get = (key) => this.map[key];
}

// Pattern Canvas - for Free Drawing
export class PCanvas {
    static menuParams = [];
    static displayName = "Canvas";
    static dimension = 200;
    static alphaMap = new AlphaMap();
    static p = new Processing(document.getElementById('idCanvas'), (processing) => {
        processing.setup = () => {
            processing.size(1,1);
        }
    });

    static color = (r, g, b, a) => {
        const trueColor = PCanvas.p.color(r,g,b,a);
        const mappedColor = PCanvas.p.color(r * a/255, g * a/255, b * a/255, 255);
        if (!PCanvas.alphaMap[mappedColor]) {
            PCanvas.alphaMap.add(mappedColor, trueColor);
        }
        return mappedColor;
    };

    brushLife = 200;
    memoizer = new Memoizer();
    
    constructor () {
        this.processing = new Processing(document.getElementById('idCanvas'), this._setupProcessing);
        this.brushes = [];
        this.params = {
            Brightness: 100
        }
    }

    progress () {
        this.processing.pg.background(0);
        for (let i = this.brushes.length - 1; i >= 0; i--) {
            this.brushes[i].render(this.processing);
            this.brushes[i].timer += 1;

            if (this.brushes[i].timer >= this.brushLife) {
                this.brushes.splice(i, 1);
            }
        }
    }

    add (brush) {
        brush.timer = 0;
        this.brushes.push(brush);
    }

    render (canopy) {
        const colorData = this.processing.pg.get();
        const pixels = colorData.pixels.toArray();
        const memoizedMap = this.memoizer.createMap(PCanvas.dimension, canopy);

        for (let x = 0; x < PCanvas.dimension; x++) {
            for (let y = 0; y < PCanvas.dimension; y++) {
                const c = pixels[y * PCanvas.dimension + x];

                // if black, skip it
                if (c === -16777216) continue;

                const c2 = PCanvas.alphaMap.get(c);
                const b = c2 & 0xFF,
                    g = (c2 & 0xFF00) >>> 8,
                    r = (c2 & 0xFF0000) >>> 16,
                    a = ( (c2 & 0xFF000000) >>> 24 ) / 255;

                const co = memoizedMap.mapCoords(x, y);
                canopy.strips[co.strip].updateColor(co.led, new RGB(r, g, b, a));
            }
        }
    }

    _setupProcessing(processing) {
        processing.setup = () => {
            processing.size(PCanvas.dimension,PCanvas.dimension);
            processing.pg = processing.createGraphics(PCanvas.dimension,PCanvas.dimension, "P2D");
            processing.pg.background(0);
        }
    }
}
