
import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { Color, RGB } from '../colors';
import { pattern } from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import Memoizer from './memoizer';


interface BubblesProps {
    color1: Color,
    color2: Color,
    brightness: number
}

@pattern()
export class Bubbles extends BasePattern {
    static displayName = 'Bubbles';

    static propTypes = {
        color1: new PatternPropTypes.Color(),
        color2: new PatternPropTypes.Color(),
        brightness: new PatternPropTypes.Range(0,100)
    };

    static defaultProps () : BubblesProps {
        return {
            color1: RGB.random(),
            color2: RGB.random(),
            brightness: 100
        };
    }

    bubbles = [];
    rateOfColorChange = 0.01;
    rateOfOpacityChange = -0.01;
    rateOfSizeChange = -0.025;

    memoizer = new Memoizer();
    dimension = 200;
    progress () {
        super.progress();
        if (Math.random() > 0.5) { 
            this.bubbles.push({
                color: this.props.color1,
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
            const { color1, color2 } = this.props;
            const memoizedMap = this.memoizer.createMap(this.dimension, canopy);
            const halfCanvas = this.dimension / 2;
            //const center = memoizedMap.mapCoords(Math.floor(bubble.x + halfCanvas), Math.floor(bubble.y + halfCanvas));
            bubble.color = new RGB(
                util.lerp(color1.r, color2.r, bubble.lerp),
                util.lerp(color1.g, color2.g, bubble.lerp),
                util.lerp(color1.b, color2.b, bubble.lerp)
            );
            const color = bubble.color.withAlpha(bubble.opacity * this.props.brightness / 100);
            const center = memoizedMap.mapCoords(Math.floor(bubble.x + halfCanvas),Math.floor(bubble.y + halfCanvas));
            let t = 0;
            while (t < 30) {
                const x = (bubble.x + halfCanvas) + (bubble.size * Math.cos(t));
                const y = (bubble.y + halfCanvas) + (bubble.size * Math.sin(t));
                if (_.inRange(x,0,this.dimension+1) && _.inRange(y, 0, this.dimension + 1)) {
                    const co = memoizedMap.mapCoords(Math.floor(x),Math.floor(y));
                    const l = co.led - 20;
                    if (_.inRange(l,0,NUM_LEDS_PER_STRIP)) {
                        canopy.strips[co.strip].updateColor(l, color); // bubble fill
                    }
                    this.fill(bubble.x + halfCanvas,bubble.y + halfCanvas,x,y,canopy,memoizedMap,color);
                }
                t++;
            }

        })
    }

    fill(x1,y1,x2,y2,canopy,memo,color) {
        const startX = x1 < x2 ? x1 : x2 ;
        const startY = y1 < y2 ? y1 : y2 ;
        const endX = x1 >= x2 ? x1 : x2;
        const endY = y1 >= y2 ? y1 : y2;
        for(let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const co = memo.mapCoords(Math.floor(x),Math.floor(y));
                const l = co.led - 20;
                if (_.inRange(l,0,NUM_LEDS_PER_STRIP)) {
                    canopy.strips[co.strip].updateColor(l, color); // bubble fill
                }
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
    
}
