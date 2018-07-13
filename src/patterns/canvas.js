import { RGB } from '../colors';
import { NUM_STRIPS } from '../canopy';

// Pattern Canvas - for Free Drawing
export class PCanvas {
    static menuParams = [];
    static displayName = "Canvas";
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
            const x2 = Math.floor(processing.map(x,0,200,-100,100));
            const y2 = Math.floor(processing.map(y,0,200,-100,100));
            return mapMemo[x2 + "-" + y2];
        }
            
        for(let i = 0; i < pixels.length; i += 4) {
            const pixel = Math.floor((i + 1) / 4);
            const x = pixel % 200;
            const y = Math.floor(pixel / 200);
            const co = mapToCanopy(x,y,processing,canopy);
            let l = co.led - 20;
            if (l < 0 || l >= canopy.numLedsPerStrip) { continue; }
            if (pixels[i] == 0 && pixels[i + 1] == 0 && pixels[i + 2] == 0) continue;
            const c = new RGB(pixels[i], pixels[i+1], pixels[i+2]);
            canopy.strips[co.strip].updateColor(l, c.toHex())
        }
    }

    _setupProcessing(processing) {
        processing.setup = () => {
            processing.size(200,200);
            processing.pg = processing.createGraphics(200,200, "P2D");
            processing.pg.background(0);
        }
    }
}

var mapMemo = {};
(function(){
    for(let x = -100;x <= 100;x++) {
        for(let y = -100;y <= 100;y++) {
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
    const s = Math.floor(thetaDegrees * NUM_STRIPS / 360);
    const l = Math.floor(radius / 3);
    return { strip: s, led: l};
}