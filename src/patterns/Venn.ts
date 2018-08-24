import * as _ from 'lodash';
import { Color, RGB } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import Memoizer from "./memoizer/index";

@pattern()
export class Venn extends BasePattern {
    static displayName = 'Venn';

    static propTypes = {
        color: new PatternPropTypes.Color,
        quantity: new PatternPropTypes.Range(2,8),
        frequency: new PatternPropTypes.Range(10,50,5)
    }

    static defaultProps () {
        return {
            color: RGB.random(),
            quantity: 2,
            frequency: 10
        }
    }

    circles = [];
    dimension = 200;
    memoizer = new Memoizer();
    progress() {
        super.progress();
        if (this.iteration % this.values.frequency === 0) {
            this.circles.push(0);
        }
       for (let i = 0 ; i < this.circles.length; i++) {
           this.circles[i] += 1;
           if (this.circles[i] > 100) {
               this.circles = _.without(this.circles, this.circles[i]);
           }
       }
    }

    render(canopy) {
        const memoMap = this.memoizer.createMap(this.dimension,canopy);
        const centerRadius = 30;
        const TWO_PI = Math.PI * 2;
        const half = this.dimension / 2;
        this.circles.forEach(circle => {
            for (let i = 0; i < this.values.quantity; i++) {
                const x = Math.floor(centerRadius * Math.cos(TWO_PI / this.values.quantity * i) + half);
                const y = Math.floor(centerRadius * Math.sin(TWO_PI / this.values.quantity * i) + half);

                let t = 0;
                while (t < 100) {
                    const x2 = x + Math.floor(circle * Math.cos(t));
                    const y2 = y + Math.floor(circle * Math.sin(t));
                    if (_.inRange(x2,0,this.dimension) && _.inRange(y2,0,this.dimension)) {
                        const co = memoMap.mapCoords(x2,y2);
                        if (_.inRange(co.led,0,canopy.stripLength)) {
                            canopy.strips[co.strip].updateColor(co.led, this.values.color.withAlpha((100 - circle) / 100));
                        }
                    }
                    t++;
                }
            }
        });
    }

    serializeExtra() {
        return {
            circles: this.circles
        }
    }

    deserializeExtra(obj) {
        this.circles = obj.circles;
    }

}