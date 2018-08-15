import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
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
        length: new PatternPropTypes.Range(1, NUM_LEDS_PER_STRIP),
        gap: new PatternPropTypes.Range(1,10),
        direction: new PatternPropTypes.Enum(SpiralDirection),
        brightness: new PatternPropTypes.Range(0,100)
    };

    lines = [];
    adder = 0;
    colorOffset = 0;

    static defaultProps () {
        return {
            length: 10,
            brightness: 100,
            gap: 1,
            direction: SpiralDirection.inwards
        };
    }

    progress() {
        super.progress();
        this.lines.push( {
            strip: this.adder,
            head: this.props.direction === SpiralDirection.inwards ? NUM_LEDS_PER_STRIP : 0,
            hue: this.colorOffset
        });
        this.adder += this.props.gap;
        this.adder %= NUM_STRIPS;
        

        this.lines.forEach(line => {
            if (this.props.direction === SpiralDirection.inwards) {
                line.head--;
                if (line.head + this.props.length < 0) { this.lines = _.without(this.lines, line); }
            }
            else if (this.props.direction === SpiralDirection.outwards) {
                line.head++;
                if (line.head - this.props.length >= NUM_LEDS_PER_STRIP ) { this.lines = _.without(this.lines, line); }
            }
        });
        this.colorOffset++;
    }

    render(canopy) {
        this.lines.forEach((line) => {
            const color = (new HSV(((line.hue + this.colorOffset) % NUM_STRIPS) / NUM_STRIPS,1,1)).toRgb().withAlpha(this.props.brightness / 100);
            for (let l = 0; l < this.props.length; l++) {
                const led = this.props.direction === SpiralDirection.inwards ? line.head + l : line.head - l;
              
                if (led >= 0 && led < NUM_LEDS_PER_STRIP) {
                    canopy.strips[line.strip].updateColor(led, color);
                }
            }
        });
    }
}