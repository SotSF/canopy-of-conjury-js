
import _ from 'lodash';
import {PCanvas} from '.';


export class Fireflies {
    static menuParams = [
        {name: "Color", defaultVal: { r: 255, g: 255, b: 0}},
        {name: "Qty", defaultVal: 50, min: 10, max: 100},
        {name: "Velocity", defaultVal: 0, min: 0, max: 10},
        {name: "Size", defaultVal: 5, min: 1, max: 10},
        {name: "Rotate", defaultVal: 0, min: -10, max: 10},
        {name: "Brightness", defaultVal: 100, min: 0, max: 100}
    ]
    static displayName = "Fireflies";

    constructor(params) {
        this.params = params;
        this.canvas = new PCanvas();

        this.fireflies = [];
        this.r = 1;
        for (let i = 0;i <= 10; i++) {
            this.addFirefly()
        }
    }

    addFirefly() {
        const size = this.params.Size + Math.random() * 5 - 5;
        const x = Math.random() * PCanvas.dimension;
        const y = Math.random() * PCanvas.dimension;
        const offset = Math.random() * 5;
        const brightness = Math.random() * 10;
        // dir = [brightness, radius, theta]
        this.fireflies.push({brightness, offset, size, x, y, dir: [1,1,1], age: 0, radius: 0, theta: 0});
    }

    renderFirefly(firefly) {
        const { processing } = this.canvas;
        const c = this.params.Color;
        processing.pg.pushMatrix();
        processing.pg.translate(firefly.x-PCanvas.dimension / 2, firefly.y-PCanvas.dimension / 2);
        processing.pg.noStroke();
        processing.pg.fill(c.r + firefly.offset, c.g + firefly.offset, c.b + firefly.offset, firefly.brightness * this.params.Brightness/100);
        const x = firefly.radius * Math.cos(firefly.theta);
        const y = firefly.radius * Math.sin(firefly.theta);
        processing.pg.ellipse(x,y,firefly.size,firefly.size);
        processing.pg.popMatrix();
    }

    updateFirefly(firefly) {
        firefly.brightness += 10 * firefly.dir[0];
        if (firefly.brightness >= 255 || firefly.brightness <= 0) firefly.dir[0] *= -1;
        firefly.age++;
        if (firefly.age >= this.params.Lifespan) _.without(this.fireflies, firefly);

        if (this.params.Velocity > 0) {
            firefly.radius += 0.1 * this.params.Velocity * firefly.dir[1];
            if (firefly.radius > 20 || Math.random() > 0.99) { firefly.dir[1] *= -1; }
            firefly.theta += 0.1 * this.params.Velocity * firefly.dir[2];
            if (Math.random() > 0.99) { firefly.dir[2] *= -1; }
        }
    }

    update() {
        const { processing } = this.canvas;
        processing.pg.beginDraw();
        processing.pg.background(0);
        processing.pg.pushMatrix();
        processing.pg.translate(PCanvas.dimension / 2, PCanvas.dimension / 2);
        processing.pg.rotate(processing.radians(this.r * this.params.Rotate));
        this.fireflies.forEach((firefly) => {
            this.renderFirefly(firefly);
            this.updateFirefly(firefly);
        });
        processing.pg.popMatrix();
        processing.pg.endDraw();
        this.r++;
        if (this.fireflies.length < this.params.Qty) { this.addFirefly(); }
        if (this.fireflies.length > this.params.Qty) { this.fireflies.splice(0, this.fireflies.length - this.params.Qty); }
    }

    render(canopy) {
      this.canvas.render(canopy);
    }
}