export class Rotate {
    static menuParams = [
        { name: "Velocity", defaultVal: 1, min: 1, max: 30},
        { name: "Clockwise", defaultVal: true }
    ];
    static displayName = "Rotate";

    constructor(params) {
        this.params = params;
    }

    applyToCanvas(processing) {

    }

    applyToCanopy(canopy) {
        
    }

}