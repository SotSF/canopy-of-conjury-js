import { NUM_STRIPS } from '../canopy';
import { RGB } from '../colors';
import { renderProcessing } from '.';

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
    constructor(processing) {
        this.processing = processing;
        this.processing.background(0);
        this.offset = 0;
    }
    update() {
        this.processing.pg.beginDraw();
        this.processing.pg.background(0);
        this.processing.pg.fill(255,255,255);
        this.processing.pg.rect(50,this.offset,50,50);
        this.offset += 3;
        if (this.offset > this.processing.width) { this.offset = 0; }
        this.processing.pg.endDraw();
    }
    render(canopy) {
        renderProcessing(canopy, this.processing);
    }
}

export class TestCanvasLayout {
     constructor(processing) {
        this.processing = processing;
        this.processing.background(0);
        this.offset = 0;
    }
    update() {
        this.processing.pg.beginDraw();
        this.processing.pg.background(255);
        this.processing.pg.fill(255,0,0);
        this.processing.pg.rect(40,40,20,20);
        this.processing.pg.fill(255,255,0);
        this.processing.pg.rect(140,140,20,20);
        this.processing.pg.fill(255,0,255);
        this.processing.pg.rect(40,140,20,20);
        this.processing.pg.fill(0,0,255);
        this.processing.pg.rect(140,40,20,20);
        this.processing.pg.endDraw();
    }
    render(canopy) {
        renderProcessing(canopy, this.processing);
    }
}