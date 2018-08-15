
import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP, NUM_STRIPS } from '../canopy';
import { Color, RGB, HSV } from '../colors';
import { AccessibleProp, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';

interface TrianglesProps {
    color: Color,
    quantity: number,
    radius: AccessibleProp<number>,
    size: AccessibleProp<number>,
    opacity: number,
    rainbow: boolean,
    inverted: boolean
}

@pattern()
export class Triangles extends BasePattern {
    static displayName = "Triangle Ring";
    static propTypes = {
        color: new PatternPropTypes.Color,
        quantity: new PatternPropTypes.Range(2,12),
        radius: new PatternPropTypes.Range(0,60).enableOscillation(),
        size : new PatternPropTypes.Range(3,15).enableOscillation(),
        opacity: new PatternPropTypes.Range(0,100),
        rainbow: new PatternPropTypes.Boolean,
        inverted: new PatternPropTypes.Boolean
    };

    static defaultProps () : TrianglesProps {
        return {
            color: RGB.random(),
            quantity: 6,
            radius: 20,
            size: 5,
            opacity: 100,
            rainbow: false,
            inverted: false
        };
    }

    currentHue = 0;
    indexOfBrightest = 0;
    progress() {
        super.progress();
        if (this.iteration % 2 === 0) { 
            this.indexOfBrightest++; 
            
            
        }
        this.indexOfBrightest %= this.props.quantity;
        this.currentHue += 1;
        this.currentHue %= 360;
        
    }

    render(canopy) {
        const radius : number = _.result(this.props, 'radius');
        const size : number = _.result(this.props, 'size');
        for (let i = 0 ; i < this.props.quantity; i++ ){
            let t = (this.indexOfBrightest - i);
            if (t < 0) t += this.props.quantity;
            const triangleOpacity = (this.props.quantity - t) / this.props.quantity;
            let color;
            if (this.props.rainbow) {
                const hue = (this.currentHue + i * 360 / this.props.quantity)%360;
                color = new HSV( hue / 360, 1, 1).toRgb().withAlpha(this.props.opacity / 100 * triangleOpacity);
            } else {
                color = this.props.color.withAlpha(this.props.opacity / 100 * triangleOpacity);
            }

            const centerStrip = Math.floor(NUM_STRIPS / this.props.quantity * i);
            const out = Math.floor(size / 2);
            for (let s = -out; s <= out; s++) {
                let strip = (centerStrip + s) % NUM_STRIPS;
                if (strip < 0) strip += NUM_STRIPS;
                for (let l = 0; l < size - Math.abs(s * 2); l++) {
                    const led = Math.floor(radius + l);
                    if (_.inRange(led, 0, NUM_LEDS_PER_STRIP)) {
                    canopy.strips[strip].updateColor(led, color)
                    }
                }
            }
        }
    }
}