
import { CanopyInterface, PatternInstance } from '../types';


export default abstract class BasePattern implements PatternInstance {
    props = null;
    iteration = 0;

    // These must each be implemented in inheriting classes
    abstract updateProps (o: any);
    abstract render (canopy: CanopyInterface);

    constructor (props) {
        // If no props are provided, use the default props
        // @ts-ignore: I don't know how to teach typescript that class will have the static property
        this.props = props || this.constructor.defaultProps();
    }

    progress () {
        this.iteration++;
    }
}
