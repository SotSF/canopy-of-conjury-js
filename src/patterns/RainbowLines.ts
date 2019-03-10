import * as _ from 'lodash';
import { NUM_COLS, NUM_ROWS } from '../grid';
import { HSV } from '../colors';
import { pattern, GridInterface } from '../types';
import BasePattern from './BasePattern';
import { VerticalDirection } from './types';
import { PatternPropTypes } from './utils';


interface ColorLineInterface {
    column: number
    head: number
    hue: number
}

@pattern()
export class RainbowLines extends BasePattern {
    static displayName = 'Rainbow Lines';
    static propTypes = {
        length: new PatternPropTypes.Range(1, NUM_COLS),
        gap: new PatternPropTypes.Range(1,10),
        direction: new PatternPropTypes.Enum(VerticalDirection),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation()
    };

    lines: ColorLineInterface[] = [];
    injectionPoint = 0;
    colorOffset = 0;

    static defaultProps () {
        return {
            length: 10,
            opacity: 1,
            gap: 1,
            direction: VerticalDirection.up
        };
    }

    progress() {
        super.progress();

        this.lines.push({
            column: this.injectionPoint,
            head: this.values.direction === VerticalDirection.up ? NUM_ROWS : 0,
            hue: this.colorOffset
        });

        this.injectionPoint += this.values.gap;
        this.injectionPoint %= NUM_COLS;

        this.lines.forEach((line) => {
            if (this.values.direction === VerticalDirection.up) {
                line.head--;
                if (line.head + this.values.length < 0) {
                    this.lines = _.without(this.lines, line);
                }
            } else if (this.values.direction === VerticalDirection.down) {
                line.head++;
                if (line.head - this.values.length >= NUM_ROWS ) {
                    this.lines = _.without(this.lines, line);
                }
            }
        });

        this.colorOffset++;
    }

    render (grid: GridInterface) {
        this.lines.forEach((line) => {
            const color = (new HSV(((line.hue + this.colorOffset) % NUM_ROWS) / NUM_ROWS, 1, 1))
                .toRgb()
                .withAlpha(this.values.opacity);
                
            for (let l = 0; l < this.values.length; l++) {
                const led = this.values.direction === VerticalDirection.up
                    ? line.head + l
                    : line.head - l;
              
                if (led >= 0 && led < NUM_ROWS) {
                    grid.strips[line.column].updateColor(led, color);
                }
            }
        });
    }

    serializeExtra () {
        return {
            adder: this.injectionPoint,
            colorOffset: this.colorOffset,
            lines: this.lines
        };
    }

    deserializeExtra (object) {
        this.injectionPoint = object.adder;
        this.colorOffset = object.colorOffset;
        this.lines = object.lines;
    }
}
