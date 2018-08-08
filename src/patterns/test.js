import { NUM_STRIPS } from '../canopy';
import { RGB, alphaMap } from '../colors';
import { PCanvas } from '.';

/**
 * Test pattern to determine order of strips
 */
export class TestLEDs {
    static displayName = "Test LEDs";
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
    progress() {}
    render(canopy) {
        var c = 0;
        for (let s = 0; s < NUM_STRIPS; s++) {
            canopy.strips[s].updateColors(this.colors[c]);
            if ((s + 1) % 8 == 0) c++;
            if (c >= this.colors.length) { c = 0; }
        }
    }
}

export class AlphaTest {
    static menuParams = [];
    static displayName = "Alpha Test";

    constructor(params) {
        this.canvas = new PCanvas();
    }

    progress() {
        const { processing } = this.canvas;
        processing.pg.beginDraw();
        processing.pg.background(0);
        for (let x = 0; x < PCanvas.dimension; x++) {
            const alpha = PCanvas.lerp(255,0,x / PCanvas.dimension);
            const c = PCanvas.color(255,0,0,alpha);
            processing.pg.stroke(c);
            processing.pg.line(x,0,x,PCanvas.dimension);
        }
        processing.pg.endDraw();
    }

    render(canopy) {
        this.canvas.render(canopy);
    }
}
