import _ from 'lodash';
import { PCanvas } from '../../patterns';

export class BubbleBrush {
    static menuParams = [
        {name: "Color1", defaultVal: {r:0, g:0,b:255}},
        {name: "Color2", defaultVal: {r:255,g:0,b:255}},
        {name: "Velocity", defaultVal: 5, min: 1, max: 10},
        {name: "Size", defaultVal: 5, min: 1, max:20}
    ];
    static displayName = "Bubbles";

    static setParams = {
        Color1: {r:0, g:0,b:255},
        Color2: {r:255,g:0,b:255},
		Velocity: 1,
		Size: 5
    }

    constructor(params, coord) {
        this.params = params;
        this.start = coord;

        this.bubbles = [];      
        this.f = 0.01;
    }

    setVelocity() {
        const theta = Math.random() * Math.PI * 2;
        const rad = this.params.Velocity;
        const x = Math.cos(theta) * rad;
        const y = Math.sin(theta) * rad;
        return [x,y];
    }

    render(processing) {
        if (Math.random() > 0.5) {
            this.bubbles.push({
                coord: {x: this.start.x, y: this.start.y},
                size: this.params.Size * Math.random(),
                brightness: 1,
                change: this.setVelocity(),
                color: {
                    r: processing.lerp(this.params.Color1.r, this.params.Color2.r, this.f), 
                    g: processing.lerp(this.params.Color1.g, this.params.Color2.g, this.f),
                    b: processing.lerp(this.params.Color1.b, this.params.Color2.b, this.f)
                }
            })
        }
        processing.pg.beginDraw();
        processing.pg.noStroke();
        this.bubbles.forEach(bubble => {
            const color = PCanvas.color(bubble.color.r, bubble.color.g, bubble.color.b, bubble.brightness * 255);
            processing.pg.fill(color);
            processing.pg.ellipse(bubble.coord.x, bubble.coord.y, bubble.size * 5, bubble.size * 5);

            bubble.coord.x += bubble.change[0];
            bubble.coord.y += bubble.change[1];
            bubble.size -= 0.01;
            bubble.brightness -= this.params.Velocity / 100;
            if (bubble.size < 0 || bubble.brightness < 0) { this.bubbles = _.without(this.bubbles, bubble); }
        });
        processing.pg.endDraw();
        this.f += 0.01;
    }
}
