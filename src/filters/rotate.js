export class Rotate {
    static menuParams = [
        { name: "Velocity", defaultVal: 1, min: 1, max: 30},
        { name: "Clockwise", defaultVal: true }
    ];
    static displayName = "Rotate";

    constructor(params) {
        this.params = params;
    }

    apply(canopy) {
        for(let i = 0; i < canopy.strips.length; i++) {
            if (this.params.Clockwise) {
                let t = (i + this.params.Velocity) % canopy.strips.length;
                [canopy.strips[i], canopy.strips[t]] = [canopy.strips[t], canopy.strips[i]];
            }
            else {
                let t = (i - this.params.Velocity);
                if (t < 0) { t += canopy.strips.length; }
                [canopy.strips[i], canopy.strips[t]] = [canopy.strips[t], canopy.strips[i]];
            }
        }
    }

}