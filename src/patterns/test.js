import { NUM_STRIPS } from '../canopy';
import { RGB, rgbToHexString } from '../colors';
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
    update() {}
    render(canopy) {
        var c = 0;
        for (let s = 0; s < NUM_STRIPS; s++) {
            canopy.strips[s].updateColors(rgbToHexString(this.colors[c]));
            if ((s + 1) % 8 == 0) c++;
            if (c >= this.colors.length) { c = 0; }
        }
    }
}