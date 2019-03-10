
import * as _ from 'lodash';
import { Direction } from '../types';

export const randomDirection = () : Direction => _.sample([
    Direction.up,
    Direction.left,
    Direction.down,
    Direction.right
]);

export const isVertical   = (d: Direction) : boolean => [Direction.up, Direction.down].includes(d);
export const isHorizontal = (d: Direction) : boolean => [Direction.left, Direction.right].includes(d);