import { NUM_LEDS_PER_STRIP } from '../canopy';
import { modifyBrightness } from '../colors';

export class ConcentricCircles {
    static menuParams = [
        {name: "Color", defaultVal: "#ffffff"},
        {name: "Qty", defaultVal: 1, min: 1, max: 10},
        {name: "Width", defaultVal: 1, min: 1, max: 5},
        {name: "Velocity", defaultVal: 1, min: 1, max: 5},
        {name: "GrowOut", defaultVal: true}
    ]

    static displayName = "Concentric Circles";

    constructor(params) {
        this.params = params;
        this.params.Brightness = 100;
        this.circles = [];
        this.offset = 0;
        
    }

    update () {
        let step = Math.floor(NUM_LEDS_PER_STRIP / this.params.Qty);
        let i = 1;
        this.circles = [];
        while (i <= this.params.Qty) {
            this.circles.push(step * i);
            i++;
        }
        this.offset += this.params.GrowOut ? this.params.Velocity : -this.params.Velocity;
        if (this.offset <= 0) this.offset = NUM_LEDS_PER_STRIP;
    }

    render (canopy) {
        const color = modifyBrightness(this.params.Brightness, this.params.Color);
        this.circles.forEach((circle) => {
            canopy.strips.forEach((strip) => {
                let i = 0;
                while (i < this.params.Width) {
                    strip.updateColor((circle + this.offset + i) % NUM_LEDS_PER_STRIP, color);
                    i++;
                }
            });
        });
    }
}
