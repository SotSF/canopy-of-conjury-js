## Writing Patterns
#### No Processing Canvas (manipulating LEDs in strips directly) 
----------
- See `/src/patterns/concentric_circles.js` for example
```javascript
export class PatternName {
    static menuParams = [
        { name: "ColorParam", defaultVal: {r: 255, g:0, b:0} }, // default color vals must be RGB or RGBA
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
            const color = new RGB(r,g,b,a); // where a is typically this.params.Brightness or related
            canopy.strips.forEach(strip => 
                strip.updateColors(color)
            )
        */
    }
}
```

- `strip.updateColor(i, color)` and `strip.updateColors(color)` expects color to be an RGBA value
=============

#### Using Processing Canvas (for utilizing ProcessingJS drawing functions)
------
- See `/src/patterns/sine_ring.js` for example
```javascript
import { PCanvas } from '.';
export class PatternName {
    static menuParams = [
        { name: "ColorParam", defaultVal: {r: 255, g:0, b:0} }, // default color vals must be RGB or RGBA
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
            const c = PCanvas.color(255,0,0,this.params.Brightness); // red with parametrized Brightness
            processing.pg.stroke(c);
            processing.pg.line(0,0,200,200);
        */
        processing.pg.endDraw();
        /* update pattern params */
    }

    render(canopy) {
        this.canvas.render(canopy);
    }
}
```