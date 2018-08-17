
import { HSV } from '../colors';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { MaybeOscillator } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface SnakeProps {
    maxLength: number
    opacity: MaybeOscillator<number>
}

export class Snake extends BasePattern {
    static displayName = 'Snake';
    static propTypes = {
        maxLength: new PatternPropTypes.Range(10, 100),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation()
    };

    static defaultProps () : SnakeProps {
        return {
            maxLength: 25,
            opacity: 1
        };
    }

    static getPoint () {
        return {
            strip: Math.floor(Math.random() * NUM_STRIPS),
            led: Math.floor(Math.random() * NUM_LEDS_PER_STRIP)
        };
    }

    static getDirection(s, t, comparer) {
        const d = t-s;
        if (d > 0 && Math.abs(d) < comparer / 2) return  1;
        if (d > 0 && Math.abs(d) > comparer / 2) return -1;
        if (d < 0 && Math.abs(d) < comparer / 2) return -1;
        if (d < 0 && Math.abs(d) > comparer / 2) return  1;
        return 0;
    }

    private target = Snake.getPoint();
    private snake = [Snake.getPoint()];
    private tail = [];

    progress () {
        super.progress();

        let lastPoint = { ...this.snake[0] };
        if (this.tail.length > 0 && this.snake.length < this.values.maxLength) {
            this.snake.push({
                strip: this.tail[0].strip,
                led: this.tail[0].led
            });

            this.tail = this.tail.slice(1);
        }

        const ds = Snake.getDirection(this.snake[0].strip, this.target.strip, NUM_STRIPS);
        const dl = Snake.getDirection(this.snake[0].led, this.target.led, NUM_LEDS_PER_STRIP);

        this.snake[0].strip += ds;
        if (this.snake[0].strip >= NUM_STRIPS) {
            this.snake[0].strip %= NUM_STRIPS;
        } else if (this.snake[0].strip < 0) {
            this.snake[0].strip += NUM_STRIPS;
        }

        this.snake[0].led += dl;
        if (this.snake[0].led >= NUM_LEDS_PER_STRIP) {
            this.snake[0].led %= NUM_LEDS_PER_STRIP;
        } else if (this.snake[0].led < 0) {
            this.snake[0].led += NUM_LEDS_PER_STRIP;
        }

        for (let i = 1; i < this.snake.length ; i++) {
            const { strip, led } = this.snake[i];
            this.snake[i] = lastPoint;
            lastPoint = { strip, led };
        }

        if (this.snake[0].strip === this.target.strip && this.snake[0].led === this.target.led) {
            this.target = Snake.getPoint();
            this.tail.push({ ...lastPoint });
        }
        this.iteration++;
    }
    
    render (canopy) {
        const opacity = this.values.opacity;
        const tHSV = new HSV(this.iteration % 360 / 360, 1, 1);
        const tRGB = tHSV.toRgb().withAlpha(opacity);

        const target = Snake.convertCoordinate({ strip: this.target.strip, led: this.target.led }, canopy);
        canopy.strips[target.strip].updateColor(target.led, tRGB);

        for (let i = 0; i < this.snake.length; i++) {
            const point = Snake.convertCoordinate(this.snake[i], canopy);

            const h = i / this.values.maxLength + this.iteration;
            const hsv = new HSV(h % 1, 1, 1);
            const color = hsv.toRgb().withAlpha(opacity);

            canopy.strips[point.strip].updateColor(point.led, color);
        }
    }

    serializeExtra () {
        return {
            snake: this.snake,
            tail: this.tail
        };
    }

    deserializeExtra (object) {
        this.snake = object.snake;
        this.tail = object.tail;
    }
}
