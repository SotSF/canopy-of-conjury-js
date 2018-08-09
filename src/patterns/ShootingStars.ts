
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB, Color } from '../colors';
import { pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface ShootingStarsProps {
    color: Color,
    velocity: number,
    vortex: number,
    brightness: number
    fromApex: boolean,
}

@pattern()
export class ShootingStars extends BasePattern {
    static displayName = 'Shooting Stars';
    static propTypes = {
        color: new PatternPropTypes.Color(),
        velocity: new PatternPropTypes.Range(0, 5),
        vortex: new PatternPropTypes.Range(-2, 2, 0.1),
        brightness: new PatternPropTypes.Range(0, 100),
        fromApex: new PatternPropTypes.Boolean(),
    };

    static defaultProps () : ShootingStarsProps {
        return {
            color: RGB.random(),
            velocity: 2,
            vortex: 0,
            brightness: 100,
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

        this.stars.forEach((star) => {
            const directionalMultiplier = this.props.fromApex ? 1 : -1;
            star.led += this.props.velocity * directionalMultiplier;
            star.strip = (star.strip + this.props.vortex) % NUM_STRIPS;

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
        const color = this.props.color.withAlpha(this.props.brightness / 100);
        this.stars.forEach((star) => {
            const converted = ShootingStars.convertCoordinate(star, canopy);
            const strip = Math.round(converted.strip) % NUM_STRIPS;
            canopy.strips[strip].updateColor(converted.led, color);
        });
    }
}
