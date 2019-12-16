
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB, Color } from '../colors';
import { MaybeOscillator, pattern, SerializedActivePattern } from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
import Memoizer from './memoizer';
import { PatternPropTypes } from './utils';


interface IFirefly {
    brightness: number
    offset: number
    size: number
    x: number
    y: number
    dir: number[]
    age: number
    radius: number
    theta: number
}

interface FireFliesPropTypes {
    color: Color,
    opacity: number,
    quantity: number,
    rotation: number,
    velocity: MaybeOscillator<number>
}

@pattern()
export class Fireflies extends BasePattern {
    static displayName = 'Fireflies';
    static propTypes = {
        color   : new PatternPropTypes.Color(),
        opacity : new PatternPropTypes.Range(0, 1, 0.01),
        quantity: new PatternPropTypes.Range(10, 100),
        rotation: new PatternPropTypes.Range(-10, 10),
        velocity: new PatternPropTypes.Range(0, 10).enableOscillation()
    };

    static defaultProps () : FireFliesPropTypes {
        return {
            color: new RGB(255, 255, 0),
            quantity: 50,
            velocity: 0,
            rotation: 0,
            opacity: 1
        };
    }

    fireflies: IFirefly[] = [];
    dimension = 200;
    lifespan = 75;
    memoizer = new Memoizer();

    initialize (pattern: Partial<SerializedActivePattern>) {
        super.initialize(pattern);

        if (!pattern.state) {
            for (let i = 0; i <= 10; i++) {
                this.addFirefly()
            }
        }
    }

    progress () {
        super.progress();

        this.fireflies.map(this.updateFirefly);

        if (this.fireflies.length < this.values.quantity) {
            this.addFirefly();
        } else if (this.fireflies.length > this.values.quantity) {
            this.fireflies.splice(0, this.fireflies.length - this.values.quantity);
        }
    }

    render (canopy) {
        const memoizedMap = this.memoizer.createMap(this.dimension, canopy);
        this.fireflies.forEach(firefly =>
            this.renderFirefly(firefly, canopy, memoizedMap)
        );
    }

    addFirefly () {
        const size = Math.floor(Math.random() * 3) + 1;
        const x = Math.random() * this.dimension;
        const y = Math.random() * this.dimension;
        const offset = Math.random() * 20;
        const brightness = Math.random() * 10;

        this.fireflies.push({
            brightness,
            offset,
            size,
            x,
            y,
            dir: [1, 1, 1],
            age: 0,
            radius: 0,
            theta: 0
        });
    }

    renderFirefly (firefly, canopy, memoMap) {
        const color = new RGB(
            this.values.color.r + firefly.offset,
            this.values.color.g + firefly.offset,
            this.values.color.b + firefly.offset,
            this.values.opacity * firefly.brightness / 255
        );

        const x = firefly.radius * Math.cos(firefly.theta);
        const y = firefly.radius * Math.sin(firefly.theta);
        const x2 = Math.floor(x + (firefly.x + this.dimension / 2));
        const y2 = Math.floor(y + (firefly.y + this.dimension / 2));
        const co = memoMap.mapCoords(x2 % this.dimension,y2 % this.dimension);
       
        const rotation = this.iteration * this.values.rotation;
        const strip = util.clampModular(co.strip + rotation, 0, NUM_STRIPS);

        // If the coordinate is beyond the canopy, don't do anything
        if (!_.inRange(co.led, 0, canopy.strips[0].length)) return;
        canopy.strips[strip].updateColor(co.led, color);

        if (firefly.size > 1) {
            const l = (co.led + 1);
            if (l >= 0 && l < NUM_LEDS_PER_STRIP) {
                canopy.strips[strip].updateColor(l, color);
            }
        }

        if (firefly.size > 2) {
            const s = (strip + 1) % NUM_STRIPS;
            canopy.strips[s].updateColor(co.led, color);
        }
    }

    updateFirefly = (firefly) => {
        firefly.brightness += 10 * firefly.dir[0];
        if (firefly.brightness >= 255 || firefly.brightness <= 0) {
            firefly.dir[0] *= -1;
        }

        firefly.age++;
        if (firefly.age >= this.lifespan) {
            this.fireflies = _.without(this.fireflies, firefly);
        }

        const velocity = this.values.velocity;
        if (velocity > 0) {
            const v = velocity / 2;
            firefly.radius += 0.1 * v * firefly.dir[1];
            if (firefly.radius > 20 || Math.random() > 0.99) {
                firefly.dir[1] *= -1;
            }

            firefly.theta += 0.1 * v * firefly.dir[2];
            if (Math.random() > 0.99) {
                firefly.dir[2] *= -1;
            }
        }
    };

    serializeState () {
        return {
            fireflies: this.fireflies
        };
    }

    deserializeState (object) {
        this.fireflies = object.fireflies;
    }
}
