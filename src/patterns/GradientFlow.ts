
import * as _ from 'lodash';

import * as util from '../util';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB, Color, HSV } from '../colors';
import { MaybeOscillator, pattern, SerializedActivePattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


enum GradientTravelDirection {
  inwards,
  outwards
}

/*
 * The color gradient travels from one color to the other and then back again. The states of this
 * enum indicate which direction the gradient is currently traveling in
 */
enum GradientPolarity {
  forwards,
  backwards
}

interface GradientFlowProps {
    color1: Color
    color2: Color
    opacity: MaybeOscillator<number>
    speed: MaybeOscillator<number>
    direction: GradientTravelDirection
}

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
@pattern()
export class GradientFlow extends BasePattern {
    static displayName = 'Gradient Flow';
    static propTypes = {
        color1: new PatternPropTypes.Color(),
        color2: new PatternPropTypes.Color(),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation(),
        speed: new PatternPropTypes.Range(1, 15).enableOscillation(),
        direction: new PatternPropTypes.Enum(GradientTravelDirection)
    };

    static defaultProps () : GradientFlowProps {
        return {
            color1: RGB.random(),
            color2: RGB.random(),
            opacity: 1,
            speed: 1,
            direction: GradientTravelDirection.outwards
        };
    }

    private ringColors: Color[] = new Array(NUM_LEDS_PER_STRIP);
    private curPolarity: GradientPolarity = GradientPolarity.forwards;
    private curPosition: number = 0;
    private interpolation: Color[] = null;

    initializeState () {
        this.interpolation = this.interpolateColors();
        this.ringColors = this.interpolation;
    }

    updateProps (props) {
        const { color1: oldColor1, color2: oldColor2 } = this.props;

        super.updateProps(props);

        // If the colors changed, update the interpolation
        if (oldColor1 !== this.props.color1 || oldColor2 !== this.props.color2) {
            this.interpolation = this.interpolateColors();
        }
    }

    private interpolateColors () : Color[] {
        const interpolatedColors: Color[] = [];
        const { color1, color2 } = this.props;

        // iterate over the length of the LED strips and derive the interpolated value
        for (let i = 0; i < NUM_LEDS_PER_STRIP; i++) {
            interpolatedColors[i] = new RGB(
                util.lerp(color1.r, color2.r, i / NUM_LEDS_PER_STRIP),
                util.lerp(color1.g, color2.g, i / NUM_LEDS_PER_STRIP),
                util.lerp(color1.b, color2.b, i / NUM_LEDS_PER_STRIP)
            );
        }

        return interpolatedColors;
    }

    private togglePolarity () : void {
        if (this.curPolarity == GradientPolarity.forwards) {
            this.curPolarity = GradientPolarity.backwards;
        } else {
            this.curPolarity = GradientPolarity.forwards;
        }
    }

    /**
     * Uses the position, direction, and the pre-computed interpolation to retrieve the next color
     */
    private getColor () : Color {
        if (this.curPolarity == GradientPolarity.forwards) {
          return this.interpolation[this.curPosition];
        } else {
          return this.interpolation[NUM_LEDS_PER_STRIP - this.curPosition - 1];
        }
    }

    progress () {
        super.progress();

        const { ringColors } = this;
        const { direction } = this.values;
        const speed: number = this.values.speed;

        // move the colors along
        if (direction == GradientTravelDirection.outwards) {
            for (let v = NUM_LEDS_PER_STRIP - 1; v >= speed; v--) {
                ringColors[v] = ringColors[v - speed];
            }
        } else {
            for (let v = 0; v <= NUM_LEDS_PER_STRIP - 1 - speed; v++) {
                ringColors[v] = ringColors[v + speed];
            }
        }

        // add new colors, flipping the gradient polarity if appropriate
        for (let i = 0; i < speed; i++) {
            this.curPosition++;
            if (this.curPosition == NUM_LEDS_PER_STRIP) {
                this.curPosition = 0;
                this.togglePolarity();
            }

            const ledToUpdate = direction == GradientTravelDirection.outwards
                ? i
                : NUM_LEDS_PER_STRIP - 1 - i;

            ringColors[ledToUpdate] = this.getColor();
        }
    }

    render (canopy) {
        this.ringColors.forEach((ringColor, i) => {
            if (!ringColor) return;

            const color = ringColor.withAlpha(this.values.opacity);
            canopy.strips.forEach(strip => strip.updateColor(i, color));
        });
    }

    serializeState () {
        return {
            ringColors: this.ringColors.map(color => color.serialize()),
            curPolarity: this.curPolarity,
            curPosition: this.curPosition
        }
    }

    deserializeState (object) {
        this.ringColors = object.ringColors.map(color => RGB.fromObject(color));
        this.curPolarity = object.curPolarity;
        this.curPosition = object.curPosition;
    }
}
