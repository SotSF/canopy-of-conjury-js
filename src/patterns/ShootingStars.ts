
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB, Color } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface ShootingStarsProps {
    color: Color
    velocity: MaybeOscillator<number>
    vortex: MaybeOscillator<number>
    brightness: MaybeOscillator<number>
    fromApex: boolean
}

@pattern()
export class ShootingStars extends BasePattern {
    static displayName = 'Shooting Stars';
    static propTypes = {
        color: new PatternPropTypes.Color(),
        velocity: new PatternPropTypes.Range(0, 5).enableOscillation(),
        vortex: new PatternPropTypes.Range(-2, 2, 0.1).enableOscillation(),
        brightness: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation(),
        fromApex: new PatternPropTypes.Boolean(),
    };

    static defaultProps () : ShootingStarsProps {
        return {
            color: RGB.random(),
            velocity: 2,
            vortex: 0,
            brightness: 1,
            fromApex: true,
        };
    }

    stars = [];

    constructor (props) {
        super(props);

        for (let i = 0; i < 3; i++) {
            this.stars.push({
                strip: Math.floor(Math.random() * NUM_STRIPS),
                led: props.fromApex ? 0 : NUM_LEDS_PER_STRIP - 1
            });
        }
    }

    progress () {
        for (let i = Math.floor(Math.random() * 10); i >= 0; i--) {
            this.stars.push({
                strip: Math.floor(Math.random() * NUM_STRIPS),
                led: this.props.fromApex ? 0 : NUM_LEDS_PER_STRIP - 1
            });
        }

        const velocity = _.result<number>(this.props, 'velocity');
        this.stars.forEach((star) => {
            const directionalMultiplier = this.props.fromApex ? 1 : -1;
            star.led += velocity * directionalMultiplier;
            star.strip = (star.strip + _.result<number>(this.props, 'vortex')) % NUM_STRIPS;

            // Wrap the star if necessary
            if (star.strip < 0) {
                star.strip += NUM_STRIPS;
            } else if (star.strip >= NUM_STRIPS) {
                star.strip -= NUM_STRIPS;
            }

            // Remove it when it has traversed the canopy
            if (star.led >= NUM_LEDS_PER_STRIP || star.led < 0) {
                this.stars = _.without(this.stars, star);
            }
        });
    }

    render (canopy) {
        const color = this.props.color.withAlpha(_.result(this.props, 'brightness'));
        this.stars.forEach((star) => {
            const converted = ShootingStars.convertCoordinate(star, canopy);
            const strip = Math.round(converted.strip) % NUM_STRIPS;
            canopy.strips[strip].updateColor(converted.led, color);
        });
    }
}
