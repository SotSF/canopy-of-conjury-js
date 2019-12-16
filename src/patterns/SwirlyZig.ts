
import * as _ from 'lodash';
import { Color } from '../colors';
import { MaybeOscillator, pattern, PatternInstance, SerializedActivePattern } from '../types';
import BasePattern from './BasePattern';
import { Swirly } from './Swirly';
import { PatternPropTypes } from './utils';


interface SwirlyZigProps {
    color1: Color
    color2: Color
    quantity: number
    opacity: MaybeOscillator<number>
    velocity: number
    fromApex: boolean
}

@pattern()
export class SwirlyZig extends BasePattern {
    static displayName = 'Swirly Zig';
    static propTypes = {
        color1: new PatternPropTypes.Color(),
        color2: new PatternPropTypes.Color(),
        quantity: new PatternPropTypes.Range(1, 100),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation(),
        velocity: new PatternPropTypes.Range(5, 30),
        fromApex: new PatternPropTypes.Boolean(),
    };

    static defaultProps () : SwirlyZigProps {
        const swirlyDefaults = Swirly.defaultProps();
        return {
            ..._.omit(swirlyDefaults, 'clockwise'),
            velocity: 10
        };
    }

    swirly: PatternInstance = null;

    initializeState () {
        this.swirly = new Swirly();
        this.swirly.initialize({
            props: {
                ...this.props,
                clockwise: true
            }
        });
    }

    /** The props need to be passed along to the `swirly` pattern */
    updateProps (props) {
        super.updateProps(props);
        this.swirly.updateProps(this.props);
    }

    progress () {
        super.progress();
        this.swirly.progress();

        if (this.iteration % this.values.velocity === 0) {
            this.swirly.updateProps({ clockwise: !this.swirly.props.clockwise });
        }
    }

    render (canopy) {
        this.swirly.render(canopy);
    }

    serializeState () {
        return this.swirly.serializeState();
    }

    deserializeState (object) {
        this.swirly.deserializeState(object);
    }
}
