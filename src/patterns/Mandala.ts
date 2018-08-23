
import * as _ from 'lodash';
import { Color, RGB } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';


enum ShapeType {
    triangle1,
    triangle2,
    line,
    quad
}

enum Direction {
    clockwise,
    counterClockwise
}

interface Shape {
    type: ShapeType,
    size: number,
    color: Color,
    radius: number,
    stripProgress: number,
    startStrip: number,
    direction: Direction
}

@pattern()
export class Mandala extends BasePattern {
    static displayName = 'Mandala';

    static propTypes = {
        opacity: new PatternPropTypes.Range(0, 1, 0.01)
    }

    static defaultProps () {
        return {
            opacity: 1
        }
    }

    shapes : Shape[] = [];
    progress() {
        super.progress();
        if (this.iteration % 10 === 0) {
            const type : ShapeType = Math.floor(Math.random() * Object.keys(ShapeType).length / 2);
            const sizeMod = type < 2 ? 10 : 5
            this.shapes.push({
                type,
                size: Math.floor(Math.random() * sizeMod) + 1,
                color: RGB.random(),
                radius: Math.floor(Math.random() * (NUM_LEDS_PER_STRIP - 10)),
                stripProgress: 1,
                startStrip: Math.floor(Math.random() * NUM_STRIPS),
                direction: Math.random() > 0.5 ? Direction.clockwise : Direction.counterClockwise
            })
        }
        this.shapes = this.shapes.filter(shape => shape.stripProgress < NUM_STRIPS * 2);
    }

    render(canopy) {
        this.shapes.forEach(shape => {
            const { startStrip, stripProgress, type } = shape;
            const color = stripProgress > NUM_STRIPS ? 
                            shape.color.withAlpha((NUM_STRIPS * 2 - stripProgress) / (NUM_STRIPS) * this.values.opacity) : 
                            shape.color.withAlpha(this.values.opacity);
            for (let s = 0; s < stripProgress; s++) {
                const strip = (startStrip + s) % NUM_STRIPS;
                switch (type) {
                    case ShapeType.quad:
                        if (s % shape.size === 0) { continue; } 
                        for (let l = shape.radius; l <= shape.radius + shape.size; l++) {
                            canopy.strips[strip].updateColor(l, color);
                        }
                        break;
                    case ShapeType.triangle1:
                        if (s % shape.size === 0) { continue; } 
                        for (let l = 0; l <= (s % shape.size); l++ ) {
                            const led = shape.radius + l;
                            if (led < canopy.stripLength) { canopy.strips[strip].updateColor(led, color); }
                        }
                        break;
                    case ShapeType.triangle2:
                        if (s % shape.size === 0) { continue; } 
                        const midpoint = Math.floor(shape.size / 2);
                        for (let l = 0; l < midpoint - Math.abs(midpoint - s % shape.size); l++)  {
                            const led = shape.radius + l;
                            if (_.inRange(led, 0, canopy.stripLength)) { canopy.strips[strip].updateColor(led, color); }
                        }
                        
                        break;
                    case ShapeType.line:
                        for (let l = shape.radius; l <= shape.radius + shape.size; l++) {
                            canopy.strips[strip].updateColor(l, color);
                        }
                        break;
                }
            }
            shape.stripProgress++;
           
        });
    }

    serializeExtra() {
        return this.shapes.map(shape => ({
            ...shape,
            color: shape.color.serialize()
        }))
    }

    deserializeExtra(obj) {
        obj.map((shape) =>
        this.shapes.push({
            ...shape,
            color: RGB.fromObject(shape.color)
        })
    );
    }

}