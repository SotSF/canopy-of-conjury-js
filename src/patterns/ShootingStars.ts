
import * as _ from 'lodash';
import { NUM_COLS, NUM_ROWS } from '../grid';
import { RGB, Color } from '../colors';
import { MaybeOscillator, pattern, Coordinateinterface } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import { scale } from '../util';

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
        trail: new PatternPropTypes.Range(1, 15),
        velocity: new PatternPropTypes.Range(0, 5).enableOscillation(),
        vortex: new PatternPropTypes.Range(-2, 2, 0.1).enableOscillation(),
        opacity: new PatternPropTypes.Range(0, 1, 0.01).enableOscillation(),
        fromApex: new PatternPropTypes.Boolean(),
    };

    static defaultProps () : ShootingStarsProps {
        return {
            color: RGB.random(),
            velocity: 2,
            vortex: 0,
            opacity: 1,
            fromApex: true,
            trail: 3
        };
    }

    stars: Coordinateinterface[];

    constructor (props: ShootingStarsProps) {
        super(props);

        this.stars = _.range(3).map(() => ({
            col: Math.floor(Math.random() * NUM_COLS),
            row: props.fromApex ? 0 : NUM_ROWS - 1
        }));
    }

    progress () {
        super.progress();

        // Update existing stars...
        const velocity = this.values.velocity;
        this.stars.forEach((star) => {
            const directionalMultiplier = this.values.fromApex ? 1 : -1;
            star.row += Math.floor(velocity * directionalMultiplier);
            star.col = Math.floor(star.col + this.values.vortex) % NUM_COLS;

            // Remove it when it has traversed the grid
            const badColumn = star.col < 0 || star.col >= NUM_COLS;
            const badRow = star.row >= NUM_ROWS || star.row < 0;
            if (badColumn || badRow) {
                this.stars = _.without(this.stars, star);
            }
        });

        // ...and make some new ones
        for (let i = Math.floor(Math.random() * 3); i >= 0; i--) {
            this.stars.push({
                col: Math.floor(Math.random() * NUM_COLS),
                row: this.values.fromApex ? 0 : NUM_ROWS - 1
            });
        }
    }

    render (grid) {
        this.stars.forEach((star) => {
            for (let l = 0; l <= this.values.trail; l++) {
                const coord = {
                    col: star.col,
                    row: this.values.fromApex ? star.row - l : star.row + l
                }

                // If the star's head or trail is off-grid, skip it
                if (coord.row < 0 || coord.row >= grid.numRows) continue;

                // The trail dims further from the star
                const dimmingFactor = this.values.trail > 0
                    ? scale(l, 0, this.values.trail, 1, 0.1)
                    : 1;

                const color = this.values.color.withAlpha(this.values.opacity * dimmingFactor);
                grid.strips[coord.col].updateColor(coord.row, color);
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
