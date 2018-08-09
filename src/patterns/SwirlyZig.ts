
import { RGB, Color } from '../colors';
import { pattern, PatternInstance } from '../types';
import BasePattern from './BasePattern';
import { Swirly } from './Swirly';
import { PatternPropTypes } from './utils';


interface SwirlyZigProps {
    color1: Color,
    color2: Color,
    quantity: number,
    brightness: number,
    fromApex: boolean,
    velocity: number
}

@pattern()
export class SwirlyZig extends BasePattern {
    static displayName = 'Swirly Zig';
    static propTypes = {
        color1: new PatternPropTypes.Color(),
        color2: new PatternPropTypes.Color(),
        quantity: new PatternPropTypes.Range(1, 100),
        brightness: new PatternPropTypes.Range(0, 100),
        fromApex: new PatternPropTypes.Boolean(),
        velocity: new PatternPropTypes.Range(5, 30)
    };

    static defaultProps () : SwirlyZigProps {
        return {
            color1: new RGB(200, 200, 15),
            color2: new RGB(200, 30, 30),
            quantity: 10,
            velocity: 10,
            brightness: 100,
            fromApex: true
        };
    }

    swirly: PatternInstance = null;

    constructor(props) {
        super(props);

        this.swirly = new Swirly({
            ...props,
            clockwise: true
        });
    }

    progress () {
        super.progress();
        this.swirly.progress();

        if (this.iteration % this.props.velocity === 0) {
            this.swirly.updateProps({ clockwise: !this.swirly.props.clockwise });
        }
    }

    render (canopy) {
        this.swirly.render(canopy);
    }
}
