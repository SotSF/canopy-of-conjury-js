
import * as _ from 'lodash';
import { NUM_ROWS, NUM_COLS } from '../grid';
import { RGB, Color } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
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
    velocity: MaybeOscillator<number>
}

@pattern()
export class Fireflies extends BasePattern {
    static displayName = 'Fireflies';
    static propTypes = {
        color   : new PatternPropTypes.Color(),
        opacity : new PatternPropTypes.Range(0, 1, 0.01),
        quantity: new PatternPropTypes.Range(10, 100),
        velocity: new PatternPropTypes.Range(0, 10).enableOscillation()
    };

    static defaultProps () : FireFliesPropTypes {
        return {
            color: new RGB(255, 255, 0),
            quantity: 50,
            velocity: 0,
            opacity: 1
        };
    }

    fireflies: IFirefly[] = [];
    dimension = 200;
    lifespan = 75;

    constructor (props) {
        super(props);

        for (let i = 0; i <= 10; i++) {
            this.addFirefly()
        }
    }

    progress () {
        super.progress();

        this.fireflies.forEach(this.updateFirefly);

        if (this.fireflies.length < this.values.quantity) {
            this.addFirefly();
        } else if (this.fireflies.length > this.values.quantity) {
            this.fireflies.splice(0, this.fireflies.length - this.values.quantity);
        }
    }

    addFirefly () {
        this.fireflies.push({
            brightness: Math.random() * 10,
            offset: Math.random() * 20,
            size: Math.floor(Math.random() * 3) + 1,
            x: Math.random() * NUM_COLS,
            y: Math.random() * NUM_ROWS,
            dir: [1, 1, 1],
            age: 0,
            radius: 0,
            theta: 0
        });
    }

    updateFirefly = (firefly: IFirefly) => {
        firefly.brightness += 10 * firefly.dir[0];
        if (firefly.brightness >= 255 || firefly.brightness <= 0) {
            firefly.dir[0] *= -1;
        }

        // If the firefly has lived a full life, kill it off the next time it's dim
        firefly.age++;
        if (firefly.age >= this.lifespan && firefly.brightness <= 0) {
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

    render (grid) {
        this.fireflies.forEach(firefly =>
            this.renderFirefly(firefly, grid)
        );
    }

    renderFirefly (firefly, grid) {
        const color = new RGB(
            this.values.color.r + firefly.offset,
            this.values.color.g + firefly.offset,
            this.values.color.b + firefly.offset,
            this.values.opacity * firefly.brightness / 255
        );

        const x = firefly.radius * Math.cos(firefly.theta);
        const y = firefly.radius * Math.sin(firefly.theta);
        const x2 = Math.floor(x + firefly.x);
        const y2 = Math.floor(y + firefly.y);

        // If the firefly is off-grid, don't render it
        if (x2 > NUM_COLS || y2 > NUM_ROWS) return;

        // Render the firefly
        grid.strips[x2].updateColor(y2, color);

        if (firefly.size > 1) {
            const oneOver = x2 + 1;
            if (oneOver < NUM_COLS) {
                grid.strips[oneOver].updateColor(y2, color);
            }
        }

        if (firefly.size > 2) {
            const oneUp = y2 + 1;
            if (oneUp < NUM_ROWS) {
                grid.strips[x2].updateColor(oneUp, color);
            }
        }
    }

    serializeExtra () {
        return {
            fireflies: this.fireflies
        };
    }

    deserializeExtra (object) {
        this.fireflies = object.fireflies;
    }
}
