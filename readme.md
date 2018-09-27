## Installation
1. Download the repository
2. Install npm packages in 3 locations
  - `/canopy-of-conjury-js`
  - `/canopy-of-conjury-js/src/client`
  - `/canopy-of-conjury-js/src/server`
3. Start the server: `cd src/server; npm start;`
4. In your favority browser, navigate to `http://localhost:3000`

## Writing Patterns
#### No Processing Canvas (manipulating LEDs in strips directly) 
----------
- See `/src/patterns/concentric_circles.js` for example
```javascript

import * as _ from 'lodash';
import { NUM_LEDS_PER_STRIP } from '../canopy';
import { Color, RGB } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface ICircle {
    color: Color
    pos: number
    width: number
    trail: number
}

interface ConcentricCirclesProps {
    color: MaybeOscillator<Color>
    width: MaybeOscillator<number>
    frequency: number
    trail: number
}

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
@pattern()
export class PatternName extends BasePattern {
    static displayName = '';

    static propTypes = {
    };

    static defaultProps () {
        return {
            
        }
    }

    progress () {
        super.progress();

    }

    render (canopy) {
    }

    serializeExtra () {
        return {
        };
    }

    deserializeExtra (obj) {
    }
}

```