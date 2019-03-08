import * as _ from 'lodash';
import { NUM_COLS, NUM_ROWS } from '../grid';
import { HSV } from '../colors';
import { pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


enum SpiralDirection {
    inwards,
    outwards
}

@pattern()
export class RainbowSpiral extends BasePattern {
    static displayName = 'Rainbow Spiral';
    static propTypes = {
        length: new PatternPropTypes.Range(1, NUM_COLS),
        gap: new PatternPropTypes.Range(1,10),
        direction: new PatternPropTypes.Enum(SpiralDirection),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation()
    };

    lines = [];
    adder = 0;
    colorOffset = 0;

    static defaultProps () {
        return {
            length: 10,
            opacity: 1,
            gap: 1,
            direction: SpiralDirection.inwards
        };
    }

    progress() {
        super.progress();

        this.lines.push({
            strip: this.adder,
            head: this.values.direction === SpiralDirection.inwards ? NUM_COLS : 0,
            hue: this.colorOffset
        });

        this.adder += this.values.gap;
        this.adder %= NUM_ROWS;

        this.lines.forEach(line => {
            if (this.values.direction === SpiralDirection.inwards) {
                line.head--;
                if (line.head + this.values.length < 0) { this.lines = _.without(this.lines, line); }
            }
            else if (this.values.direction === SpiralDirection.outwards) {
                line.head++;
                if (line.head - this.values.length >= NUM_COLS ) { this.lines = _.without(this.lines, line); }
            }
        });

        this.colorOffset++;
    }

    render(canopy) {
        this.lines.forEach((line) => {
            const color = (new HSV(((line.hue + this.colorOffset) % NUM_ROWS) / NUM_ROWS,1,1)).toRgb().withAlpha(this.values.opacity);
            for (let l = 0; l < this.values.length; l++) {
                const led = this.values.direction === SpiralDirection.inwards ? line.head + l : line.head - l;
              
                if (led >= 0 && led < NUM_COLS) {
                    canopy.strips[line.strip].updateColor(led, color);
                }
            }
        });
    }

    serializeExtra () {
        return {
            adder: this.adder,
            colorOffset: this.colorOffset,
            lines: this.lines
        };
    }

    deserializeExtra (object) {
        this.adder = object.adder;
        this.colorOffset = object.colorOffset;
        this.lines = object.lines;
    }
}
