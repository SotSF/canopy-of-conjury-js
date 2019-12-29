
import * as _ from 'lodash';
import { Color, RGB } from '../colors';
import { pattern } from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import Memoizer from './memoizer';


interface Bubble {
    color: Color
    lerp: number
    opacity: number
    size: number
    x: number
    y: number
    change: number[]
}

interface SerializedBubble {
    color: RGB
    lerp: number
    opacity: number
    size: number
    x: number
    y: number
    change: number[]
}

interface BubblesProps {
    color1: Color,
    color2: Color,
    opacity: number
}

@pattern()
export class Bubbles extends BasePattern {
    static displayName = 'Bubbles';

    static propTypes = {
        color1: new PatternPropTypes.Color(),
        color2: new PatternPropTypes.Color(),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation()
    };

    static defaultProps () : BubblesProps {
        return {
            color1: RGB.random(),
            color2: RGB.random(),
            opacity: 1
        };
    }

    props: BubblesProps;
    bubbles: Bubble[] = [];
    rateOfColorChange = 0.01;
    rateOfOpacityChange = -0.01;
    rateOfSizeChange = -0.025;

    memoizer = new Memoizer();
    dimension = 200;

    progress () {
        super.progress();
        if (Math.random() > 0.5) { 
            this.bubbles.push({
                color: this.values.color1,
                lerp: 0,
                opacity: 1,
                size: 15 * Math.random(),
                x: 0,
                y: 0,
                change: this.getChange()
            });
        }
      
        this.bubbles.forEach(bubble => {
            bubble.x += bubble.change[0];
            bubble.y += bubble.change[1];
            bubble.lerp += this.rateOfColorChange;
            bubble.lerp %= 1;
            bubble.opacity += this.rateOfOpacityChange;
            bubble.size += this.rateOfSizeChange;
            if (bubble.opacity <= 0 || bubble.size <= 0) { this.bubbles = _.without(this.bubbles, bubble); }
        });
    }

    render (canopy) {
        this.bubbles.forEach(bubble => {
            const { color1, color2 } = this.values;
            const memoizedMap = this.memoizer.createMap(this.dimension, canopy);
            const halfCanvas = this.dimension / 2;
            //const center = memoizedMap.mapCoords(Math.floor(bubble.x + halfCanvas), Math.floor(bubble.y + halfCanvas));

            bubble.color = RGB.lerp(color1, color2, bubble.lerp);
            const color = bubble.color.withAlpha(bubble.opacity * this.values.opacity);

            let t = 0;
            while (t < 30) {
                const x = (bubble.x + halfCanvas) + (bubble.size * Math.cos(t));
                const y = (bubble.y + halfCanvas) + (bubble.size * Math.sin(t));
                const validX = _.inRange(x, 0, this.dimension + 1);
                const validY = _.inRange(y, 0, this.dimension + 1);
                t++;

                if (!validX || !validY) continue;

                const co = memoizedMap.mapCoords(Math.floor(x), Math.floor(y));

                // If the coordinate is beyond the canopy, don't do anything
                if (!_.inRange(co.led - 20, 0, canopy.strips[0].length)) continue;

                canopy.strips[co.strip].updateColor(co.led - 20, color);
                this.fill(
                    bubble.x + halfCanvas,
                    bubble.y + halfCanvas,
                    x,
                    y,
                    canopy,
                    memoizedMap,
                    color
                );
            }
        })
    }

    fill (x1, y1, x2, y2, canopy, memo, color) {
        const startX = x1 <  x2 ? x1 : x2;
        const startY = y1 <  y2 ? y1 : y2;
        const endX   = x1 >= x2 ? x1 : x2;
        const endY   = y1 >= y2 ? y1 : y2;

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const co = memo.mapCoords(Math.floor(x), Math.floor(y));

                // If the coordinate is beyond the canopy, don't do anything
                if (!_.inRange(co.led - 20, 0, canopy.strips[0].length)) continue;

                canopy.strips[co.strip].updateColor(co.led - 20, color);
            }
        }
    }

    getChange() {
        const TWO_PI = 2 * Math.PI;
        const theta = Math.random() * TWO_PI;
        const rad = 1;
        const x = Math.cos(theta) * rad;
        const y = Math.sin(theta) * rad;
        return [x,y];
    }

    serializeState () {
        return this.bubbles.map(bubble => ({
            ...bubble,
            color: bubble.color.serialize()
        }));
    }

    deserializeState (bubbles: SerializedBubble[]) {
        bubbles.map((bubble) =>
            this.bubbles.push({
                ...bubble,
                color: RGB.fromObject(bubble.color)
            })
        );
    }
}
