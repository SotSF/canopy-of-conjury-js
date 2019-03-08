
import { Color, RGB } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface BackgroundColorProps {
    color: MaybeOscillator<Color>
    opacity: number
}

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
@pattern()
export class BackgroundColor extends BasePattern {
    static displayName = 'Background Color';

    static propTypes = {
        color: new PatternPropTypes.Color().enableOscillation({ frequency: 0.1 }),
        opacity: new PatternPropTypes.Range(0, 1, 0.1)
    };

    static defaultProps () : BackgroundColorProps {
        return {
            color: RGB.random(),
            opacity: 0.3
        };
    }

    render (grid) {
        grid.strips.forEach(strip =>
            strip.updateColors(this.values.color.withAlpha(this.values.opacity))
        );
    }
}
