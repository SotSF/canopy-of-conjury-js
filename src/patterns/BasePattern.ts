
import * as _ from 'lodash';
import { CanopyInterface, PatternInstance } from '../types';
import { PCanvas } from './canvas';


export default abstract class BasePattern implements PatternInstance {
    props = null;
    iteration = 0;

    // These must each be implemented in inheriting classes
    abstract render (canopy: CanopyInterface);

    constructor (props) {
        // If no props are provided, use the default props
        // @ts-ignore: I don't know how to teach typescript that class will have the static property
        this.props = props || this.constructor.defaultProps();
    }

    progress () {
        this.iteration++;
    }
    updateProps (props) {
        _.merge(this.props, props);
    }
}

export abstract class BaseProcessingPattern extends BasePattern {
    canvas = null;

    constructor (props) {
        super(props);
        this.canvas = new PCanvas();
    }
}
