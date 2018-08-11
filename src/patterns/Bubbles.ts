
import * as _ from 'lodash';
import { Color, RGB } from '../colors';
import { pattern } from '../types';
import * as util from '../util';
import { BaseProcessingPattern } from './BasePattern';
import { PatternPropTypes } from './utils';
import { PCanvas } from './canvas';


interface BubblesProps {
    color1: Color,
    color2: Color,
    size: number,
    brightness: number
}

@pattern()
export class Bubbles extends BaseProcessingPattern {
    static displayName = 'Bubbles';

    static propTypes = {
        color1: new PatternPropTypes.Color(),
        color2: new PatternPropTypes.Color(),
        size: new PatternPropTypes.Range(15,30),
        brightness: new PatternPropTypes.Range(0,100)
    };

    static defaultProps () : BubblesProps {
        return {
            color1: RGB.random(),
            color2: RGB.random(),
            size: 15,
            brightness: 100
        };
    }

    bubbles = [];
    rateOfColorChange = 0.01;
    rateOfOpacityChange = -0.01;
    rateOfSizeChange = -0.025;

    progress () {
        super.progress();
        if (Math.random() > 0.25) { 
            this.bubbles.push({
                color: this.props.color1,
                lerp: 0,
                opacity: 1,
                size: this.props.size * Math.random(),
                x: 0,
                y: 0,
                change: this.getChange()
            });
        }
        const { color1, color2 } = this.props;
        const { processing } = this.canvas;
        processing.pg.beginDraw();
        processing.pg.background(0);
        processing.pg.noStroke();
        processing.pg.pushMatrix();
        const halfCanvas = PCanvas.dimension / 2;
        processing.pg.translate(halfCanvas, halfCanvas);
        this.bubbles.forEach(bubble => {

            bubble.color = new RGB(
                util.lerp(color1.r, color2.r, bubble.lerp),
                util.lerp(color1.g, color2.g, bubble.lerp),
                util.lerp(color1.b, color2.b, bubble.lerp)
            );
            const opacity = bubble.opacity * 255;
            const color = PCanvas.color(bubble.color.r, bubble.color.g, bubble.color.b, opacity * this.props.brightness / 100);
            processing.pg.fill(color)
            processing.pg.ellipse(bubble.x, bubble.y, bubble.size, bubble.size);

            bubble.x += bubble.change[0];
            bubble.y += bubble.change[1];
            bubble.lerp += this.rateOfColorChange;
            bubble.lerp %= 1;
            bubble.opacity += this.rateOfOpacityChange;
            bubble.size += this.rateOfSizeChange;
            if (bubble.opacity <= 0 || bubble.size <= 0) { this.bubbles = _.without(this.bubbles, bubble); }
            
        });
        processing.pg.popMatrix();
        processing.pg.endDraw();
     
    }

    render (canopy) {
        this.canvas.render(canopy);
    }

    getChange() {
        const TWO_PI = 2 * Math.PI;
        const theta = Math.random() * TWO_PI;
        const rad = 1;
        const x = Math.cos(theta) * rad;
        const y = Math.sin(theta) * rad;
        return [x,y];
    }
    
}
