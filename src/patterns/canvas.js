// Pattern Canvas - for Free Drawing
class AlphaMap {
    map = {};
    add = (key, value) => {
        this.map[key] = value;
    }
    get = (key) => {
        return this.map[key];
    }
}

export class PCanvas {
    static menuParams = [];
    static displayName = "Canvas";
    static dimension = 100;
    static mapMemo = {}; // faster mapping from Cartesian to Canopy-Polar
    static alphaMap = new AlphaMap(); // bug in HTML5 Canvas that loses RGBA alpha values; keep map of true values for rendering
    static p = new Processing(document.getElementById('idCanvas'), (processing) => {
        processing.setup = () => {
            processing.size(1,1);
        }
    });
    static lerp = (a,b,c) => {
        return PCanvas.p.lerp(a,b,c);
    }

    /* 
        HTML5 canvas, and thus Processing canvas, loses alpha values, so we need to preserve original
        color information to preserve transparency
    */
    static color = (r,g,b,a) => {
        const trueColor = PCanvas.p.color(r,g,b,a);
        const mappedColor = PCanvas.p.color(r * a/255, g * a/255, b * a/255, 255);
        if (!PCanvas.alphaMap[mappedColor]) {
            PCanvas.alphaMap.add(mappedColor, trueColor);
        }
        return mappedColor;
    }

    brushLife = 200;
    
    constructor() {
        this.processing = new Processing(document.getElementById('idCanvas'), this._setupProcessing);
        this.brushes = [];
        this.params = {
            Brightness: 100
        }
    }

    progress() {
        this.processing.pg.background(0);
        for (let i = this.brushes.length - 1; i >= 0; i--) {
            this.brushes[i].render(this.processing);
            this.brushes[i].timer += 1;
            if (this.brushes[i].timer >= this.brushLife) { this.brushes.splice(i, 1); }
        }
    }

    render(canopy) { 
        this._renderProcessing(canopy, this.processing);
    }

    add(brush) {
        brush.timer = 0;
        this.brushes.push(brush);
    }

    _renderProcessing(canopy, processing) {
        const colorData = processing.pg.get();
        const pixels = colorData.pixels.toArray();
    

        const mapToCanopy = (x,y,processing,canopy) => {
            const x2 = Math.floor(processing.map(x,0,PCanvas.dimension,-PCanvas.dimension/2,PCanvas.dimension/2));
            const y2 = Math.floor(processing.map(y,0,PCanvas.dimension,-PCanvas.dimension/2,PCanvas.dimension/2));
            return PCanvas.mapMemo[x2 + "-" + y2];
        }

        for (let x = 0; x < PCanvas.dimension; x++) {
            for (let y = 0; y < PCanvas.dimension; y++) {
                const c = pixels[y * PCanvas.dimension + x];
                if (c == -16777216) continue; // if black, skip it
                const c2 = PCanvas.alphaMap.get(c);
                const b = c2 & 0xFF,
                    g = (c2 & 0xFF00) >>> 8,
                    r = (c2 & 0xFF0000) >>> 16,
                    a = ( (c2 & 0xFF000000) >>> 24 ) / 255;
                const co = mapToCanopy(x,y,processing,canopy);
                let l = co.led - 35;
                canopy.strips[co.strip].updateColor(l, {r,g,b,a})
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
