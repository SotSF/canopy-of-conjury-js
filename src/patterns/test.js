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
    processing = new Processing(document.getElementById('idCanvas'), this._sketch);
    canvas = new Canvas();
    _sketch(processing) {
        var offset = 0;
        processing.setup = function() {
            processing.size(500,500);
            processing.background(0);
        }
        processing.draw = function () {
            processing.background(0);
            processing.fill(255,255,255);
            processing.rect(190,offset,120,120);
            offset += 10;
            if (offset > processing.width) { offset = 0; }
        }
    }
    update() {}
    render(canopy) {
        this.canvas.render(canopy);
    }
}