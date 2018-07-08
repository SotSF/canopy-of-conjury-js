import { RGB } from '../colors';

// Pattern Canvas - for Free Drawing
export class PCanvas {
    constructor(processing) {
        this.processing = processing;
        this.processing.pg.background(0);
        this.brushes = [];
    }
    update() {
        this.processing.pg.background(0);
        for (let i = this.brushes.length - 1; i >= 0; i--) {
            this.brushes[i].render(this.processing);
            this.brushes[i].timer += 1;
            if (this.brushes[i].timer >= 60) { this.brushes.splice(i, 1); }
        }
    };
    render(canopy) { 
        renderProcessing(canopy, this.processing);
    }

    add(brush) {
        brush.timer = 0;
        this.brushes.push(brush);
    }
}

var mapMemo = {};
var worker = new Worker('worker.js');
worker.addEventListener('message', function(e) {
    mapMemo[e.data.carte[0] + "-" + e.data.carte[1]] = { strip: e.data.rad[0], led: e.data.rad[1] };
}, false);
(function(){
    for(let x = -100;x <= 100;x++) {
        for(let y = -100;y <= 100;y++) {
            worker.postMessage({coord: [x,y]});
        }
    }
})();

export function renderProcessing(canopy, processing) {
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