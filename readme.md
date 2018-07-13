## Writing Patterns
#### No Processing Canvas (manipulating LEDs in strips directly) 
----------
- See `/src/patterns/concentric_circles.js` for example
```javascript
export class PatternName {
    static menuParams = [
        { name: "ColorParam", defaultVal: "#ff0000" },
        { name: "NumberParam", defaultVal: 1, min: 1, max: 10 },
        { name: "CheckboxParam", defaultVal: true }
    ];
    static displayName = 'Pattern Name';
    constructor(params) {
        this.params = params;

        /*
            properties independent of this.params should be set here
        */
    }
    update() {
        /*
            any properties dependent on this.params should be set here
            manipulate the pattern, update properties
        */
    }

    render(canopy) {
        /*
            apply colors to canopy.strips here, e.g., 
            canopy.strips.forEach(strip => 
                strip.updateColor("#ff0000")
            )
        */
    }
}
```

- `strip.updateColor(i, color)` and `strip.updateColors(color)` expects color to be a hex value (0xff0000) or hex string ("#ff0000");
=============

#### Using Processing Canvas (for utilizing ProcessingJS drawing functions)
------
- See `/src/patterns/sine_ring.js` for example
```javascript
export class PatternName {
    static menuParams = [
        { name: "ColorParam", defaultVal: "#ff0000" },
        { name: "NumberParam", defaultVal: 1, min: 1, max: 10 },
        { name: "CheckboxParam", defaultVal: true }
    ];
    static displayName = 'Pattern Name';
    constructor(params) {
        this.params = params;
        this.canvas = new PCanvas(); // create a new processing canvas instance
        /*
            properties independent of this.params should be set here
        */
    }
    update() {
        const { processing } = this.canvas;
        processing.pg.beginDraw();
        processing.pg.background(0);
        /*
            any properties dependent on this.params should be set here
            apply processing functions here, e.g.
            processing.stroke(255);
            processing.line(0,0,200,200);
        */
        processing.pg.endDraw();
        /* update pattern params */
    }

    render(canopy) {
        this.canvas.render(canopy);
    }
}
```