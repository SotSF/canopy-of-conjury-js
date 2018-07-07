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

export function renderProcessing(canopy, processing) {
    const colorData = processing.pg.get();
    const pixels = colorData.imageData.data;
    const mapToCanopy = (x,y,processing,canopy) => {
        const x2 = Math.floor(processing.map(x,0,processing.width,-processing.width/2,processing.width/2));
        const y2 = Math.floor(processing.map(y,0,processing.height,-processing.height/2,processing.height/2));
        let theta = 0;
        if (x2 == 0) {
            if (y2 > 0) theta = Math.PI / 2;
            if (y2 < 0) theta = -Math.PI / 2;
            if (y2 == 0) theta = 0;
        } else {
            theta = Math.atan2(y2,x2);
        }
        const radius = Math.sqrt(x2 * x2 + y2 * y2) * 3;
        let thetaDegrees = theta * 180 / Math.PI;
        if (thetaDegrees < 0) { thetaDegrees += 360; }
        const s = Math.floor(thetaDegrees * canopy.numStrips / 360);
        const l = Math.floor(radius / 3);
        return { strip: s, led: l };
    }
        
    for(let i = 0; i < pixels.length; i += 4) {
        const pixel = Math.floor((i + 1) / 4);
        const x = pixel % processing.width;
        const y = Math.floor(pixel / processing.height);
        const co = mapToCanopy(x,y,processing,canopy);
        let l = co.led - 20;
        if (l < 0 || l >= canopy.numLedsPerStrip) { continue; }
        if (pixels[i] == 0 && pixels[i + 1] == 0 && pixels[i + 2] == 0) continue;
        const c = new RGB(pixels[i], pixels[i+1], pixels[i+2]);
        canopy.strips[co.strip].updateColor(l, c.toHex())
    }
}