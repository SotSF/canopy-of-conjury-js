import { RGB, rgbToHexString } from '../colors';
import { NUM_STRIPS } from '../canopy';

// Pattern Canvas - for Free Drawing
export class PCanvas {
    static menuParams = [];
    static displayName = "Canvas";
    static dimension = 200;

    brushLife = 200;
    
    constructor() {
        this.processing = new Processing(document.getElementById('idCanvas'), this._setupProcessing);
        this.brushes = [];
        this.params = {
            Brightness: 100
        }
    }
    update() {
        this.processing.pg.background(0);
        for (let i = this.brushes.length - 1; i >= 0; i--) {
            this.brushes[i].render(this.processing);
            this.brushes[i].timer += 1;
            if (this.brushes[i].timer >= this.brushLife) { this.brushes.splice(i, 1); }
        }
    };
    render(canopy) { 
        this._renderProcessing(canopy, this.processing);
    }

    add(brush) {
        brush.timer = 0;
        this.brushes.push(brush);
    }

    _renderProcessing(canopy, processing) {
        const colorData = processing.pg.get();
        const pixels = colorData.imageData.data;
        const mapToCanopy = (x,y,processing,canopy) => {
            const x2 = Math.floor(processing.map(x,0,PCanvas.dimension,-PCanvas.dimension/2,PCanvas.dimension/2));
            const y2 = Math.floor(processing.map(y,0,PCanvas.dimension,-PCanvas.dimension/2,PCanvas.dimension/2));
            return mapMemo[x2 + "-" + y2];
        }
            
        for(let i = 0; i < pixels.length; i += 4) {
            const pixel = Math.floor((i + 1) / 4);
            const x = pixel % PCanvas.dimension;
            const y = Math.floor(pixel / PCanvas.dimension);
            const co = mapToCanopy(x,y,processing,canopy);
            let l = co.led - 35;
            if (l < 0 || l >= canopy.numLedsPerStrip) { continue; }
            if (pixels[i] == 0 && pixels[i + 1] == 0 && pixels[i + 2] == 0) continue;
            const c = new RGB(pixels[i], pixels[i+1], pixels[i+2]);
            canopy.strips[co.strip].updateColor(l, rgbToHexString(c))
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

var mapMemo = {};
(function(){
    for(let x = -PCanvas.dimension/2;x <= PCanvas.dimension/2;x++) {
        for(let y = -PCanvas.dimension/2;y <= PCanvas.dimension/2;y++) {
            mapMemo[x + "-" + y] = _mapToCanopy(x,y);
        }
    }
})();



function _mapToCanopy(x,y) {
    let theta = 0;
    if (x == 0) {
        if (y > 0) theta = Math.PI / 2;
        if (y < 0) theta = -Math.PI / 2;
        if (y == 0) theta = 0;
    } else {
        theta = Math.atan2(y,x);
    }
    const radius = Math.sqrt(x * x + y * y) * 3;
    let thetaDegrees = theta * 180 / Math.PI;
    if (thetaDegrees < 0) { thetaDegrees += 360; }
    const s = parseInt(thetaDegrees * NUM_STRIPS / 360);
    const l = parseInt(radius / 3);
    return { strip: s, led: l};
}