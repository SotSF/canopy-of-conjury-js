import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { HSV, RGB } from '../colors';
import _ from 'lodash';

export class Snake {
    static menuParams = [
        {name: "MaxLength", defaultVal: 25, min: 10, max:100},
        {name: "Brightness", defaultVal: 100, min: 0, max:100}
    ]
    static displayName = "Snake";
    constructor(params) {
        this.params = params;

        this.target = this.getPoint();
        this.snake = [this.getPoint()];
        this.tail = [];
        this.hueOffset = -1;
    }

    progress () {
        var lastPoint = [this.snake[0][0],this.snake[0][1]];
        if (this.tail.length > 0 && this.snake.length < this.params.MaxLength) {
            this.snake.push([this.tail[0][0], this.tail[0][1]]);
            this.tail = this.tail.slice(1);
        }

        
        const ds = this.getDirection(this.snake[0][0], this.target[0], NUM_STRIPS);
        const dl = this.getDirection(this.snake[0][1], this.target[1], NUM_LEDS_PER_STRIP);


        this.snake[0][0] += ds;
        if (this.snake[0][0] >= NUM_STRIPS) { this.snake[0][0] %= NUM_STRIPS; }
        if (this.snake[0][0] < 0) { this.snake[0][0] += NUM_STRIPS; }

        this.snake[0][1] += dl;       
        if (this.snake[0][1] >= NUM_LEDS_PER_STRIP) { this.snake[0][1] %= NUM_LEDS_PER_STRIP; }
        if (this.snake[0][1] < 0) { this.snake[0][1] += NUM_LEDS_PER_STRIP; }

        for (let i = 1; i < this.snake.length ; i++) {
            let point = this.snake[i];
            const memo = [point[0],point[1]]
            this.snake[i] = [lastPoint[0], lastPoint[1]];
            lastPoint = [memo[0],memo[1]];
        };

        if (this.snake[0][0] == this.target[0] && this.snake[0][1] == this.target[1]) {
            this.target = this.getPoint();
            this.tail.push([lastPoint[0],lastPoint[1]]);
        }  
        this.hueOffset++;
    }
    
    render(canopy) {
        
        const tHSV = new HSV(this.hueOffset % 100, 100, 100);
        const tRGB = tHSV.toRgb();
        tRGB.a = this.params.Brightness/100;
        canopy.strips[this.target[0]].updateColor(this.target[1], tRGB);
        for (let i = 0; i < this.snake.length; i++) {
            const point = this.snake[i];
            const h = 100 * i / this.params.MaxLength + this.hueOffset;
            const hsv = new HSV(h % 100,100,100);
            const color = hsv.toRgb();
            color.a = this.params.Brightness / 100;
            canopy.strips[point[0]].updateColor(point[1], color);
        }
        
    }

    getDirection(s,t,comparer) {
        const d = t-s;
        if (d > 0 && Math.abs(d) < comparer / 2) {
            return 1;
        }
        if (d > 0 && Math.abs(d) > comparer / 2) {
            return -1;
        }

        if (d < 0 && Math.abs(d) < comparer / 2) {
            return -1;
        }
        if (d < 0 && Math.abs(d) > comparer / 2) {
            return 1;
        }

        return 0;

    }

    getPoint() {
        const s = Math.floor(Math.random() * NUM_STRIPS);
        const l = Math.floor(Math.random() * NUM_LEDS_PER_STRIP);
        return [s,l];
    }
}
