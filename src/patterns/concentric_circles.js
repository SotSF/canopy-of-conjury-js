import { NUM_LEDS_PER_STRIP } from '../canopy';
import { modifyBrightness } from '../colors';

export class ConcentricCircles {
    static menuParams = [
        {name: "Color", defaultVal: "#ff0000"}, // color of circles
        {name: "Qty", defaultVal: 1, min: 1, max: 10}, // number of circles
        {name: "Width", defaultVal: 1, min: 1, max: 5}, // stroke width 
        {name: "Velocity", defaultVal: 1, min: 1, max: 5}, // rate of change of movement (in and out)
        {name: "GrowOut", defaultVal: true}, // if true, circles move from apex to base; else, base to apex
        {name: "Brightness", defaultVal: 100, min: 0, max: 100} // brightness/opacity of pattern
    ]

    static displayName = "Concentric Circles"; // name displayed on menu
    constructor(params) {
        this.params = params; // set params from UI

        this.offset = 0; // offset kept by pattern to track offset position
        
    }

    update () {
        let step = Math.floor(NUM_LEDS_PER_STRIP / this.params.Qty);
        let i = 1;
        this.circles = []; // list kept by pattern to store base position of circles
        // since this.circles is dependent on this.params.Qty, set it in update(), not constructor()
        // this way, if user update this.params.Qty from UI, it is immediately reflected in next update()
        while (i <= this.params.Qty) {
            this.circles.push(step * i);
            i++;
        }
        // update this.offset with latest from this.params
        this.offset += this.params.GrowOut ? this.params.Velocity : -this.params.Velocity;
        if (this.offset <= 0) this.offset = NUM_LEDS_PER_STRIP;
    }

    render (canopy) {
        // apply this.params.Brightness
        const color = modifyBrightness(this.params.Brightness, this.params.Color);
        // for each position in this.circles, updateColor() for the corresponding LED in each canopy.strips
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
