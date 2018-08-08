
import _ from 'lodash';
import { NUM_STRIPS } from '../canopy';
import { RGB } from '../colors';


export class Radar {
    // define tuning params
    static menuParams = [
        {name: "Color", defaultVal: {r: 255, g: 0, b: 0}},
        {name: "Velocity", defaultVal: 1, min: 1, max: 10},
        {name: "Brightness", defaultVal: 100, min: 0, max: 100},
        {name: "Clockwise", defaultVal: true}
    ];
    // define display name
    static displayName = "Radar";

    constructor(params) {
        // set instance params
        this.params = params;

        this.head = 0;
        this.length = 20;
    }

    progress () {
        this.head += this.params.Clockwise ? -this.params.Velocity : this.params.Velocity;
        if (this.head > NUM_STRIPS - 1) this.head = 0;
        if (this.head < 0) this.head = NUM_STRIPS - 1;
    }

    render (canopy) {
        for (let i = 0; i < this.length; i++) {
            const b = this.params.Brightness - (5 * i);
            const c = new RGB(this.params.Color.r, this.params.Color.g, this.params.Color.b, b < 0 ? 0 : b / 100);
            let s = this.head + (this.params.Clockwise ? i : -i);
            if (s > NUM_STRIPS - 1) s %= NUM_STRIPS;
            if (s < 0) s += NUM_STRIPS;
            canopy.strips[s].updateColors(c);
        }
    }
}
