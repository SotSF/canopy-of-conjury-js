
import * as _ from 'lodash';
import { Color, RGB } from '../colors';
import { MaybeOscillator, pattern, GridInterface } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes, randomDirection, isVertical, sampleGaussian } from './utils';
import { Direction } from './types';
import { NUM_ROWS, NUM_COLS } from '../grid';
import { clamp, scale } from '../util';


interface IStreak {
    direction: Direction
    row: number
    col: number
    position: number
    color: Color
    length: number
}

interface StreaksProps {
    rate: number
}

/**
 * Emits pulse rings from center - each ring is a different color, following a gradient color scheme
 */
@pattern()
export class Streaks extends BasePattern {
    static displayName = 'Streaks';

    static propTypes = {
        rate: new PatternPropTypes.Range(0.01, 1, 0.01)
    };

    static defaultProps () : StreaksProps {
        return {
            rate: 0.1,
        };
    }

    streaks: IStreak[] = [];

    progress () {
        super.progress();

        // Update existing streaks
        this.streaks.forEach((streak) => {
            // Move the streak forward
            streak.position++;

            // If it's completed traversing, remove it
            const tailPosition = streak.position - streak.length;
            const doneTraversing = isVertical(streak.direction)
                ? tailPosition > NUM_ROWS
                : tailPosition > NUM_COLS;

            if (doneTraversing) this.streaks = _.without(this.streaks, streak);
        });

        // If a random number is less than the `rate` value, create a new streak
        if (Math.random() < this.values.rate) {
            const direction = randomDirection();
            this.streaks.push({
                direction,
                row: isVertical(direction) ? null : _.sample(_.range(NUM_ROWS)),
                col: isVertical(direction) ? _.sample(_.range(NUM_COLS)) : null,
                position: 0,
                color: RGB.random(),
                length: Math.floor(sampleGaussian() * 100)
            })
        }
    }

    render (grid: GridInterface) {
        this.streaks.forEach((streak) => {
            let
                positiveDirection: Direction,
                gridEnd: number,
                verticalStreak: boolean;

            if (isVertical(streak.direction)) {
                positiveDirection = Direction.up;
                gridEnd = NUM_ROWS;
                verticalStreak = true;
            } else {
                positiveDirection = Direction.right;
                gridEnd = NUM_COLS;
                verticalStreak = false;
            }

            const streakStart = streak.direction === positiveDirection
                ? clamp(streak.position - streak.length, 0, gridEnd)
                : clamp(gridEnd - streak.position, 0, gridEnd);

            const streakEnd = streak.direction === positiveDirection
                ? clamp(streak.position, 0, gridEnd)
                : clamp(gridEnd - streak.position + streak.length, 0, gridEnd);
            
            // The row/col that the streak would end on if the grid were infinite
            const virtualStart = streak.direction === positiveDirection
                ? streak.position
                : gridEnd - streak.position;

            const virtualEnd = streak.direction === positiveDirection
                ? virtualStart - streak.length
                : virtualStart + streak.length;
            
                
            // Iterate across the rows/cols
            _.range(streakStart, streakEnd).forEach((cell) => {
                const row = verticalStreak ? cell : streak.row;
                const col = verticalStreak ? streak.col : cell;

                // Calculate opacity
                const opacity = scale(cell, virtualStart, virtualEnd, 1, 0.1);
                grid.strips[col].updateColor(row, streak.color.withAlpha(opacity));
            });
        });
    }

    serializeExtra () {
        return {
            streaks: this.streaks.map(streak => ({
                ...streak,
                color: streak.color.serialize()
            }))
        };
    }

    deserializeExtra (object) {
        this.streaks = object.streaks.map(streak => ({
            ...streak,
            color: RGB.fromObject(streak.color)
        }));
    }
}
