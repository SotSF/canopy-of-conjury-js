
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB } from '../colors';



export class ConcentricCircles {
    static params = [
        {name: "Color", defaultVal: "#fff"},
        {name: "Qty", defaultVal: 1, min: 1, max: 10},
        {name: "Width", defaultVal: 1, min: 1, max: 5},
        {name: "Velocity", defaultVal: 1, min: 1, max: 5},
        {name: "GrowOut", defaultVal: true}
    ]
    constructor(params) {
        this.circles = [];
        let step = Math.floor(NUM_LEDS_PER_STRIP / params.Qty);
        let i = 1;
        while (i <= params.Qty) {
            this.circles.push(step * i);
            i++;
        }
        this.color = params.Color;
        this.width = params.Width;
        this.growOut = params.GrowOut;
        this.velocity = params.Velocity;
        this.offset = 0;
    }

    update () {
        this.offset += this.growOut ? this.velocity : -this.velocity;
        if (this.offset <= 0) this.offset = NUM_LEDS_PER_STRIP;
    }

    render (canopy) {
        this.circles.forEach((circle) => {
            canopy.strips.forEach((strip) => {
                let i = 0;
                while (i < this.width) {
                    strip.updateColor((circle + this.offset + i) % NUM_LEDS_PER_STRIP, this.color);
                    i++;
                }
            });
        });
    }
}
