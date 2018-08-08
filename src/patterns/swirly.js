
import _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB } from '../colors';
import * as util from '../util';


export class Swirly {
    static menuParams = [
        { name: "Color1", defaultVal: {r: 255, g: 0, b: 0}},
        { name: "Color2", defaultVal: {r: 0, g: 0, b: 255}},
        { name: "FromApex", defaultVal: true },
        { name: "RotateClockwise", defaultVal: true},
        { name: "Qty", defaultVal: 10, min: 1, max: 100 },
        { name: "Brightness", defaultVal: 100, min: 0, max: 100}
    ];
    static displayName = 'Swirly';

    constructor(params) {
        this.params = params;
        /*
            properties independent of this.params should be set here
        */
        this.offset = 0;
        this.f = 0.01;
        this.colorRate = 0.05;
        this.colorDir = 1;

        // initialize swirls
        this.swirls = [];
        this.color = params.Color1;
        const max = params.Qty < 10 ? params.Qty : 10;
        for (let i = 0; i <= max; i++) {
            const head = [parseInt(Math.random() * NUM_STRIPS), (params.FromApex ? 0 : NUM_LEDS_PER_STRIP - 1)];
            this.swirls.push({
                max: parseInt(Math.random() * 30 + 15),
                lights: [
                    [head[0], head[1]]
                ],
                head: head,
                color: this.color
            });
        }
    }

    progress() {
        /*
            any properties dependent on this.params should be set here
            manipulate the pattern, update properties
        */
        if (this.swirls.length < this.params.Qty) {
            const head = [parseInt(Math.random() * NUM_STRIPS), (this.params.FromApex ? 0 : NUM_LEDS_PER_STRIP - 1)];
            this.swirls.push({
                max: parseInt(Math.random() * 30 + 15),
                lights: [
                    [head[0], head[1]]
                ],
                head: head,
                color: this.color,
                isComplete: false
            })
        }
        this.swirls.forEach(swirl => {
            if (swirl.lights.length < swirl.max && !swirl.isComplete) { swirl.lights.push([swirl.head[0], swirl.head[1]]); }
            else { swirl.isComplete = true; }

            swirl.lights.forEach((light,i) => {
                light[0] += this.params.RotateClockwise ? -1 : 1;
                light[1] += this.params.FromApex ? 1 : -1;
                if (light[0] >= NUM_STRIPS) { light[0] %= NUM_STRIPS; }
                if (light[0] < 0) { light[0] = NUM_STRIPS - 1}
                if (light[1] >= NUM_LEDS_PER_STRIP || light[1] < 0) {
                    swirl.lights = _.without(swirl.lights, light);
                }
                if (swirl.lights.length == 0) { this.swirls = _.without(this.swirls, swirl); }
               
            });
        })
        const color1 = this.params.Color1;
        const color2 = this.params.Color2;
        this.color = { r: util.lerp(color1.r,color2.r,this.f), g: util.lerp(color1.g,color2.g,this.f), b: util.lerp(color1.b,color2.b,this.f) };
        this.f += this.colorRate * this.colorDir;
        if (this.f >= 1) { this.f = 1; this.colorDir = -1; }
        if (this.f <= 0) { this.f = 0; this.colorDir = 1; }
        if (this.swirls.length > this.params.Qty) { this.swirls.splice(0, this.swirls.length - this.params.Qty); }
    }

    render(canopy) {
        /*
            apply colors to canopy.strips here, e.g., 
            canopy.strips.forEach(strip => 
                strip.updateColor("#ff0000")
            )
        */
       const b = this.params.Brightness;
        this.swirls.forEach(swirl => {
            swirl.lights.forEach(light => {
                const color = new RGB(swirl.color.r, swirl.color.g, swirl.color.b, b/100);
                canopy.strips[light[0]].updateColor(light[1], color);
            })
        })
    }
}
