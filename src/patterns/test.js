import { NUM_STRIPS } from '../canopy';
import { RGB } from '../colors';
import { Canvas } from '.';

/**
 * Test pattern to determine order of strips
 */
export class TestLEDs {
    colors = [
        new RGB(255,0,0),
        new RGB(255,255,0),
        new RGB(0,255,0),
        new RGB(0,255,255),
        new RGB(0,0,255),
        new RGB(255,0,255),
        new RGB(150,150,255),
        new RGB(255,150,150)
    ];
    update() {}
    render(canopy) {
        var c = 0;
        for (let s = 0; s < NUM_STRIPS; s++) {
            canopy.strips[s].updateColors(this.colors[c].toHex());
            if ((s + 1) % 8 == 0) c++;
            if (c >= this.colors.length) { c = 0; }
        }
    }
}

export class TestCanvas {
    canvas = new Canvas();
    constructor(processing) {
        this.processing = processing;
        this.offset = 0;
    }
    update() {
        this.processing.background(0);
        this.processing.fill(255,255,255);
        this.processing.rect(190,this.offset,120,120);
        this.offset += 10;
        if (this.offset > this.processing.width) { this.offset = 0; }
    }
    render(canopy) {
        this.canvas.render(canopy);
    }
}