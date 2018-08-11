
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { Color, RGB } from '../colors';
import { pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


const LIFECYCLE_END = 500;

interface FadeProps {
    colors: Color[],
    speed: number
}

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
@pattern()
export class Fade extends BasePattern {
    static displayName = 'Fade';

    static propTypes = {
        colors: new PatternPropTypes.Array(PatternPropTypes.Color),
        speed: new PatternPropTypes.Range(1, 10)
    };

    static defaultProps (): FadeProps {
        return {
            colors: [RGB.random(), RGB.random()],
            speed: 2
        };
    }

    // Keep `colorIndex` so we know which color to proceed to next (in case the same color appears
    // twice); keep `currentColor` in case the current active color is removed while it is being
    // displayed
    colorIndex = null;
    currentColor = null;

    // Keeps track of where in the lifecycle of a color we are. 0 is the start, and `LIFECYCLE_END`
    // is the end.
    lifecycle = 0;

    constructor (props) {
        super(props);

        if (props.colors.length) {
            this.colorIndex = 0;
            this.currentColor = props.colors[0];
        }
    }

    progress () {
        super.progress();

        // If we now have a color, start the cycle
        if (this.currentColor === null && this.props.colors.length) {
            this.colorIndex = 0;
            this.currentColor = this.props.colors[this.colorIndex];
            return;
        }

        // If the current color is finished, reset the lifecycle
        else if (this.lifecycle > LIFECYCLE_END) {
            this.lifecycle = 0;

            // Choose a new color if there are any
            if (this.props.colors.length) {
                this.colorIndex = (this.colorIndex + 1) % this.props.colors.length;
                this.currentColor = this.props.colors[this.colorIndex];
            } else {
                this.colorIndex = null;
                this.currentColor = null;
            }
        }

        // If we've got a color in process...
        else if (this.currentColor) {
            this.lifecycle += this.props.speed;
        }
    }

    render (canopy) {
        // If there's no color, there's nothing to do
        if (!this.currentColor) return;

        const amplitude = Math.sin(Math.PI * (this.lifecycle / LIFECYCLE_END));
        const color = this.currentColor.withAlpha(amplitude);

        canopy.strips.forEach((strip) => {
            strip.updateColors(color);
        });
    }
}