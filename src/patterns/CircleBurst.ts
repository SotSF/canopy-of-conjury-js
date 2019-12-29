import * as _ from 'lodash';
import { Color, RGB, HSV } from '../colors';
import { pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';

interface ICircle {
    points: number[],
    color: Color
}

enum ColorScheme {
    'Select Color',
    'Select Range',
    Rainbow
}

interface CircleBurstProps {
    color: RGB
    decay: number,
    frequency: number,
    colorScheme: ColorScheme
}

@pattern()
export class CircleBurst extends BasePattern {
    static displayName = 'Circle Burst';

    static propTypes = {
        color: new PatternPropTypes.Color(),
        decay: new PatternPropTypes.Range(0.5, 0.85, 0.05),
        frequency: new PatternPropTypes.Range(20, 100, 10),
        colorScheme: new PatternPropTypes.Enum(ColorScheme)
    }

    static defaultProps () {
        return {
            color: RGB.random(),
            decay: 0.75,
            frequency: 50,
            colorScheme: ColorScheme['Select Color']
        }
    }

    props: CircleBurstProps;
    threshold = 10;
    circles: ICircle[] = [];
    freshPoints = Array.apply(null, Array(NUM_STRIPS)).map(Number.prototype.valueOf, 0);
    currHue = 0;

    progress() {
        super.progress();
       
        if (this.iteration % this.values.frequency === 0) {
            const color = this.setColor()
            this.circles.push({
                points: this.freshPoints.slice(),
                color
            })
        }

        this.circles.forEach(circle => {
            circle.points.forEach((point,i) => {
                if (point >= NUM_LEDS_PER_STRIP) return;
                if (point < this.threshold) { circle.points[i] += 1; }
                else {
                    if (Math.random() < this.values.decay) {
                        circle.points[i] += 3;
                    }
                }
            });  
            if (circle.points.length === 0) { this.circles = _.without(this.circles, circle); }
        });

    }

    render(canopy) {
        const trail = 50;
        this.circles.forEach(circle => {
            circle.points.forEach((point, i) => {
                if (_.inRange(point, 0, canopy.stripLength)) {
                    canopy.strips[i].updateColor(point, circle.color);
                    for (let l = 0; l < trail; l++) {
                        if (_.inRange(point - l, 0, canopy.stripLength)) {
                        canopy.strips[i].updateColor(point - l, circle.color.withAlpha((trail - l)/trail));
                        }
                    }
                    
                }
            })
        });
    }

    setColor() {
        const { color } = this.values;
        switch (this.values.colorScheme) {
            case ColorScheme.Rainbow:
                this.currHue = (this.currHue + 0.05) % 1;
                return new HSV(this.currHue, 1, 1).toRgb();
            case ColorScheme['Select Color']:
                return color;
            case ColorScheme['Select Range']:
                const hsv = color.toHsv();
                const hueChange = 0.05 * Math.random() * 4;
                return new HSV((hsv.h + hueChange) % 1, 1, 1).toRgb();
        }
    }

    serializeState() {
        return {
            circles: this.circles.map((circle) => ({
            ...circle,
            color: circle.color,
            currHue: this.currHue
        })) }
    }

    deserializeState(obj) {
        this.circles = obj.circles.map((circle) => ({
            ...circle,
            color: RGB.fromObject(circle.color)
        }));
        this.currHue = obj.currHue;
    }
}