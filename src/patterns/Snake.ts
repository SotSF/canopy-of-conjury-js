
import { HSV } from '../colors';
import { NUM_COLS, NUM_ROWS } from '../grid';
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
            row: Math.floor(Math.random() * NUM_ROWS),
            col: Math.floor(Math.random() * NUM_COLS)
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
                row: this.tail[0].row,
                col: this.tail[0].col
            });

            this.tail = this.tail.slice(1);
        }

        const snakeHead = this.snake[0];
        const ds = Snake.getDirection(snakeHead.row, this.target.row, NUM_ROWS);
        const dl = Snake.getDirection(snakeHead.col, this.target.col, NUM_COLS);

        snakeHead.row += ds;
        if (snakeHead.row >= NUM_ROWS) {
            snakeHead.row %= NUM_ROWS;
        } else if (snakeHead.row < 0) {
            snakeHead.row += NUM_ROWS;
        }

        snakeHead.col += dl;
        if (snakeHead.col >= NUM_COLS) {
            snakeHead.col %= NUM_COLS;
        } else if (snakeHead.col < 0) {
            snakeHead.col += NUM_COLS;
        }

        for (let i = 1; i < this.snake.length ; i++) {
            const { row, col } = this.snake[i];
            this.snake[i] = lastPoint;
            lastPoint = { row, col };
        }

        if (snakeHead.row === this.target.row && snakeHead.col === this.target.col) {
            this.target = Snake.getPoint();
            this.tail.push({ ...lastPoint });
        }
        this.iteration++;
    }
    
    render (grid) {
        const opacity = this.values.opacity;
        const tHSV = new HSV(this.iteration % 360 / 360, 1, 1);
        const tRGB = tHSV.toRgb().withAlpha(opacity);

        const target = Snake.convertCoordinate({ strip: this.target.row, led: this.target.col }, grid);
        grid.strips[target.row].updateColor(target.col, tRGB);

        for (let i = 0; i < this.snake.length; i++) {
            const point = Snake.convertCoordinate(this.snake[i], grid);

            const h = i / this.values.maxLength + this.iteration;
            const hsv = new HSV(h % 1, 1, 1);
            const color = hsv.toRgb().withAlpha(opacity);

            grid.strips[point.row].updateColor(point.col, color);
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
