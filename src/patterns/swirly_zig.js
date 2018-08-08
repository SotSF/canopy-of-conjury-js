import { Swirly } from '.';

export class SwirlyZig {
    static menuParams = [
        { name: "Color1", defaultVal: {r: 255, g: 0, b: 0}},
        { name: "Color2", defaultVal: {r: 0, g: 0, b: 255}},
        { name: "FromApex", defaultVal: true },
        { name: "Qty", defaultVal: 40, min: 1, max: 100 },
        { name: "Velocity", defaultVal: 10, min: 5, max: 30 },
        { name: "Brightness", defaultVal: 100, min: 0, max: 100}
    ];
    static displayName = 'Swirly Zig';

    constructor(params) {
        this.params = params;
        params.RotateClockwise = true;
        this.swirly = new Swirly(params);
        this.timer = 0;
    }

    progress () {
        this.swirly.progress();

        if (this.timer % this.params.Velocity === 0) {
            this.swirly.params.RotateClockwise = !this.swirly.params.RotateClockwise;
        }

        this.timer++;
    }

    render(canopy) {
        this.swirly.render(canopy);
    }
}
