
import * as _ from 'lodash';
import { RGB, Color } from '../colors';
import { pattern } from '../types';
import { PCanvas } from './canvas';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface FireFliesPropTypes {
    brightness: number,
    color: Color,
    lifespan: number,
    quantity: number,
    rotation: number,
    size: number,
    velocity: number
}


@pattern()
export class Fireflies extends BasePattern {
    static displayName = 'Fireflies';
    static propTypes = {
        brightness: new PatternPropTypes.Range(0, 100),
        color     : new PatternPropTypes.Color(),
        lifespan  : new PatternPropTypes.Range(10, 100),
        quantity  : new PatternPropTypes.Range(10, 100),
        range     : new PatternPropTypes.Range(-10, 10),
        size      : new PatternPropTypes.Range(1, 10),
        velocity  : new PatternPropTypes.Range(0, 10)
    };

    static defaultProps () : FireFliesPropTypes {
        return {
            color: new RGB(255, 255, 0),
            lifespan: 75,
            quantity: 50,
            velocity: 0,
            size: 5,
            rotation: 0,
            brightness: 100
        };
    }

    fireflies = [];
    canvas = null;

    constructor (props) {
        super(props);

        this.canvas = new PCanvas();

        for (let i = 0; i <= 10; i++) {
            this.addFirefly()
        }
    }

    updateProps (properties: FireFliesPropTypes) {
        _.merge(this.props, properties);
    }

    progress () {
        super.progress();

        const { processing } = this.canvas;
        processing.pg.beginDraw();
        processing.pg.background(0);
        processing.pg.pushMatrix();
        processing.pg.translate(PCanvas.dimension / 2, PCanvas.dimension / 2);
        processing.pg.rotate(processing.radians(this.iteration * this.props.rotation));

        this.fireflies.forEach((firefly) => {
            this.renderFirefly(firefly);
            this.updateFirefly(firefly);
        });

        processing.pg.popMatrix();
        processing.pg.endDraw();

        if (this.fireflies.length < this.props.quantity) {
            this.addFirefly();
        } else if (this.fireflies.length > this.props.quantity) {
            this.fireflies.splice(0, this.fireflies.length - this.props.quantity);
        }
    }

    render (canopy) {
      this.canvas.render(canopy);
    }

    addFirefly () {
        const size = this.props.size + Math.random() * 5 - 5;
        const x = Math.random() * PCanvas.dimension;
        const y = Math.random() * PCanvas.dimension;
        const offset = Math.random() * 5;
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

    renderFirefly (firefly) {
        const { processing } = this.canvas;

        processing.pg.pushMatrix();
        processing.pg.translate(firefly.x-PCanvas.dimension / 2, firefly.y-PCanvas.dimension / 2);
        processing.pg.noStroke();

        const { r, g, b } = this.props.color.toRgb();
        const color = PCanvas.color(r + firefly.offset, g + firefly.offset, b + firefly.offset, firefly.brightness * this.props.brightness/100);
        processing.pg.fill(color);

        const x = firefly.radius * Math.cos(firefly.theta);
        const y = firefly.radius * Math.sin(firefly.theta);
        processing.pg.ellipse(x,y,firefly.size,firefly.size);
        processing.pg.popMatrix();
    }

    updateFirefly (firefly) {
        firefly.brightness += 10 * firefly.dir[0];
        if (firefly.brightness >= 255 || firefly.brightness <= 0) firefly.dir[0] *= -1;
        firefly.age++;
        if (firefly.age >= this.props.lifespan) _.without(this.fireflies, firefly);

        if (this.props.velocity > 0) {
            const v = this.props.velocity / 2;
            firefly.radius += 0.1 * v * firefly.dir[1];
            if (firefly.radius > 20 || Math.random() > 0.99) { firefly.dir[1] *= -1; }
            firefly.theta += 0.1 * v * firefly.dir[2];
            if (Math.random() > 0.99) { firefly.dir[2] *= -1; }
        }
    }
}
