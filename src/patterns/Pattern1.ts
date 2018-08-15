
import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { Color, RGB } from '../colors';
import { AccessibleProp, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';

@pattern()
export class Pattern extends BasePattern {
    static displayName = "Pattern";
    static propTypes = {
        beat: new PatternPropTypes.Range(60,180)
    };

    static defaultProps () {
        return {
            beat: 120
        };
    }

    progress() {
        super.progress();
    }

    render(canopy) {

    }
}