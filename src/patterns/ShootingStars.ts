
import * as _ from 'lodash';
import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from '../canopy';
import { RGB, Color } from '../colors';
import { MaybeOscillator, pattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';


interface ShootingStarsProps {
    color: MaybeOscillator<Color>
    velocity: MaybeOscillator<number>
    vortex: MaybeOscillator<number>
    opacity: MaybeOscillator<number>
    fromApex: boolean,
    trail: number
}

@pattern()
export class ShootingStars extends BasePattern {
    static displayName = 'Shooting Stars';
    static propTypes = {
        color: new PatternPropTypes.Color().enableOscillation(),
        velocity: new PatternPropTypes.Range(0, 5).enableOscillation(),
        vortex: new PatternPropTypes.Range(-2, 2, 0.1).enableOscillation(),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation(),
        fromApex: new PatternPropTypes.Boolean(),
        trail: new PatternPropTypes.Range(1,30)
    };

    static defaultProps () : ShootingStarsProps {
        return {
            color: RGB.random(),
            velocity: 2,
            vortex: 0,
            opacity: 1,
            fromApex: true,
            trail: 1
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
        super.progress();

        for (let i = Math.floor(Math.random() * 10); i >= 0; i--) {
            this.stars.push({
                strip: Math.floor(Math.random() * NUM_STRIPS),
                led: this.values.fromApex ? 0 : NUM_LEDS_PER_STRIP - 1
            });
        }

        const velocity = this.values.velocity;
        this.stars.forEach((star) => {
            const directionalMultiplier = this.values.fromApex ? 1 : -1;
            star.led += Math.floor(velocity * directionalMultiplier);
            star.strip = Math.floor(star.strip + this.values.vortex) % NUM_STRIPS;

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
        
        this.stars.forEach((star) => {
            for (let l = 0; l <= this.values.trail; l++) {
                let coord = {
                    strip: star.strip,
                    led: this.values.fromApex ? star.led - l : star.led + l
                }
                if (coord.led < 0) coord.led = 0;
                if (coord.led >= canopy.stripLength) coord.led = canopy.stripLength - 1;
                const converted = ShootingStars.convertCoordinate(coord, canopy);
                const strip = Math.round(converted.strip) % NUM_STRIPS;
                const color = this.values.color.withAlpha(this.values.opacity * ((this.values.trail - l) / this.values.trail));
                canopy.strips[strip].updateColor(converted.led, color);
            }
          
        });
    }

    serializeExtra () {
        return {
            stars: this.stars
        };
    }

    deserializeExtra (object) {
        this.stars = object.stars;
    }
}
