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
    update() {
        this.canvas.ctx.fillStyle = 'rgb(255,0,0)';        
        this.canvas.ctx.fillRect(50,50,100,100);
        this.canvas.ctx.fillStyle = 'rgb(255,255,0)';
        this.canvas.ctx.fillRect(350,50,100,100);
        this.canvas.ctx.fillStyle = 'rgb(0,255,0)';
        this.canvas.ctx.fillRect(50,350,100,100);
        this.canvas.ctx.fillStyle = 'rgb(0,0,255)';
        this.canvas.ctx.fillRect(350,350,100,100);
        this.canvas.ctx.fillStyle = 'rgb(255,255,255)';
        this.canvas.ctx.fillRect(190,190,120,120);
    }
    render(canopy) {
        this.canvas.render(canopy);
    }
}