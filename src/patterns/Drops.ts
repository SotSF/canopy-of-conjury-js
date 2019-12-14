import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { Color, RGB } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import Memoizer from "./memoizer/index";



interface IRing {
    opacity: number,
    radius: number
}

interface IDrop {
    x: number
    y: number
    rings: IRing[]
    added: number
    opacity: number
    color: Color
}

interface Props {
    color: MaybeOscillator<Color>
    frequency: number
}

@pattern()
export class Drops extends BasePattern {
    static displayName = 'Drops';

    static propTypes = {
        color: new PatternPropTypes.Color().enableOscillation(),
        frequency: new PatternPropTypes.Range(1,10)
    };

    static defaultProps (): Props {
        return {
            color: RGB.random(),
            frequency: 5
        };
    }

    drops : IDrop[] = [];

    memoizer = new Memoizer();
    dimension = 300;
    ringDist = 20;
    currHue = 0;

    progress () {
        super.progress();
        if (this.iteration % this.values.frequency === 0) {
            const x = Math.floor(Math.random() * this.dimension);
            const y = Math.floor(Math.random() * this.dimension);
            this.drops.push({
                x,
                y,
                rings: [],
                added: this.iteration,
                opacity: 1,
                color: this.values.color
            });

            this.currHue += 10;
            this.currHue %= 360;
        }

        this.drops.forEach(drop => {
            const t = this.iteration - drop.added;
            if (t % this.ringDist === 0) {
                drop.rings.push({
                    opacity: 1,
                    radius: 0
                });
            }

            drop.rings.forEach(ring => {
                ring.radius++;
                if (ring.opacity > 0) ring.opacity -= 0.01;
            });

            drop.opacity -= 0.01;
            if (drop.opacity <= 0) { this.drops = _.without(this.drops, drop); }
        });
    }

    render (canopy) {
        const memoizedMap = this.memoizer.createMap(this.dimension, canopy);
        this.drops.forEach(drop => {
            const { x,y } = drop;
            drop.rings.forEach(ring => {
                let t = 0;
                while (t < 100) {
                    const x2 = Math.floor(ring.radius * Math.cos(t)) + x;
                    const y2 = Math.floor(ring.radius * Math.sin(t)) + y;
                    if (_.inRange(x2, 0, this.dimension) && _.inRange(y2, 0, this.dimension)) {
                        const co = memoizedMap.mapCoords(x2,y2);
                        if (_.inRange(co.led, 0, NUM_LEDS_PER_STRIP)) {
                            const color = drop.color.withAlpha(ring.opacity * drop.opacity);
                            canopy.strips[co.strip].updateColor(co.led, color);
                        }
                    }
                    t++;
                }
            });
        });
    }

    serializeExtra () {
        return {
            drops: this.drops.map(drop => ({
                ...drop,
                color: drop.color.serialize()
            }))
        };
    }

    deserializeExtra (obj) {
        this.drops = obj.drops.map(drop => ({
            ...drop,
            color: RGB.fromObject(drop.color)
        }));
    }
}
