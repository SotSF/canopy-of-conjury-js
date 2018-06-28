import { RGB } from '../colors';

export { GradientPulse } from './gradient_pulse';
export { TestLEDs, TestCanvas } from './test';

export function renderCanvas(canopy) {

}

/*for interacting with the <canvas> element that will house Processing sketches*/
export class Canvas {
    constructor() {
        this.el = document.getElementById("idCanvas");
        this.ctx = this.el.getContext('2d');
    }
	render(canopy) {
        this._clearCanopy(canopy);
        // all the pixel info for the canvas, every 4 nums in the U8IntArray is R,G,B,A
        const colorData = this.ctx.getImageData(0,0,this.el.width,this.el.height).data; 
        for(let i = 0; i < colorData.length; i += 4) {
            const pixel = Math.floor((i + 1) / 4);
            const x = pixel % this.el.width;
            const y = Math.floor(pixel / this.el.height);
            const co = this._mapToCanopy(x,y,canopy);
            let l = co.led - 10;
            if (l < 0 || l >= canopy.numLedsPerStrip) { continue; }
            const c = new RGB(colorData[i], colorData[i+1], colorData[i+2]);
            if (c.toHex() == '0x000000') { continue; }
            canopy.strips[co.strip].updateColor(l, c.toHex())
        }
	}

    _clearCanopy(canopy) {
        for (let s = 0; s < canopy.numStrips; s++) {
            canopy.strips[s].updateColors("0x000000");
        }
    }

    // Map 2d cartesian to Canopy strips and leds
	_mapToCanopy(x, y, canopy) {
		const dimension = this.el.height;
		const maxRadius = Math.sqrt(2 * dimension * dimension);
		const x2 = Math.floor(this._map_range(x,0,dimension,-dimension/2,dimension/2));
		const y2 = Math.floor(this._map_range(y,0,dimension,-dimension/2,dimension/2));
		let theta = 0;
		if (x2 == 0) {
			if (y2 > 0) theta = Math.PI / 2;
		    if (y2 < 0) theta = -Math.PI / 2;
		    if (y2 == 0) theta = 0;
	    } else {
	    	theta = Math.atan2(y2,x2);
		}
        const radius = Math.sqrt(x2 * x2 + y2 * y2);
        let thetaDegrees = theta * 180 / Math.PI;
        if (thetaDegrees < 0) { thetaDegrees += 360; }
        const s = Math.floor(thetaDegrees * canopy.numStrips / 360);
        const l = Math.floor(radius / 3);
        return { strip: s, led: l };
	}


	_map_range(value, low1, high1, low2, high2) {
	    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}
}
