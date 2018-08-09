
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB, Color } from '../colors';
import { pattern } from '../types';
import * as util from '../util';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface ShootingStarsProps {
    color: Color,
    velocity: number,
    brightness: number
    fromApex: boolean,
    vortex: boolean
}

@pattern()
export class ShootingStars extends BasePattern {
    static displayName = 'Shooting Stars';
    static propTypes = {
        color: new PatternPropTypes.Color(),
        velocity: new PatternPropTypes.Range(0, 5),
        brightness: new PatternPropTypes.Range(0, 100),
        fromApex: new PatternPropTypes.Boolean(),
        vortex: new PatternPropTypes.Boolean()
    };

    static defaultProps () : ShootingStarsProps {
        return {
            color: RGB.random(),
            velocity: 2,
            brightness: 100,
            fromApex: true,
            vortex: false
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

            if (this.props.vortex) {
                star.strip = (star.strip + 1) % NUM_STRIPS;
            }

            if (star.led >= NUM_LEDS_PER_STRIP || star.led < 0) {
                this.stars = _.without(this.stars, star);
            }
        });
    }

    render (canopy) {
        const color = this.props.color.withAlpha(this.props.brightness / 100);
        this.stars.forEach((star) => {
            // Scale the star's strip and LED to match the current canopy
            const canopyStrip = Math.round(
                util.scale(star.strip, 0, NUM_STRIPS - 1, 0, canopy.strips.length - 1)
            );

            const canopyLed = Math.round(
                util.scale(star.led, 0, NUM_LEDS_PER_STRIP - 1, 0, canopy.stripLength - 1)
            );

            canopy.strips[canopyStrip].updateColor(canopyLed, color);
        });
    }
}
