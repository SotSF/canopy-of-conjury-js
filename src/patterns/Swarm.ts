import * as _ from 'lodash';
import { Color, RGB } from '../colors';
import { MaybeOscillator, pattern, SerializedActivePattern } from '../types';
import BasePattern from './BasePattern';
import { PatternPropTypes } from './utils';
import Memoizer from "./memoizer/index";

interface ICoord {
    x: number,
    y: number
}
interface IBug {
    center: ICoord, // invisible center of bug's motion pattern
    radius: number, // radius controlling position, centered on bug.center
    theta: number, // theta controlling position, centered on bug.center
    velocity: number, // speed at which the bug move towards the target
    jitter: number[] // size 2 array, [0] jitters radius, [1] jitters theta
}

interface ISwarm {
    center: ICoord,
    bugs: IBug[]   
}

@pattern()
export class Swarm extends BasePattern {
    static displayName = 'Swarm';

    static propTypes = {
        color: new PatternPropTypes.Color()
    }

    static defaultProps () {
        return {
            color: RGB.random()
        }
    }
   
    memoizer = new Memoizer();
    dimension = 200;

    maxSwarmRadius = 30;
    swarm : ISwarm = {
        center: { x: 0, y: 0}, // for centering new bugs
        bugs: []
    };
    swarmSize = 200;
    swarmTime = 50;
    swarmClock = 0;
    target : ICoord = { x: 0, y: 0 };

    initializeState () {
        for (let i = 0; i < this.swarmSize; i++) {
            const center = {
                x: this.swarm.center.x + Math.floor((Math.random() * (this.maxSwarmRadius + this.maxSwarmRadius + 1)) - this.maxSwarmRadius),
                y: this.swarm.center.y + Math.floor((Math.random() * (this.maxSwarmRadius + this.maxSwarmRadius + 1)) - this.maxSwarmRadius),
            };

            this.swarm.bugs.push({
                center,
                radius: 1,
                theta: 0,
                velocity: Math.floor(Math.random() * 5 + 2),
                jitter: [1,1]
            });
        }
    }
    
    progress() {
        super.progress();
        this.updateSwarm();

        let slowBugs = 0;
        this.swarm.bugs.forEach(bug => {
            this.updateBug(bug);
            if (Math.sqrt((this.target.x - bug.center.x) ** 2 + (this.target.y - bug.center.y) ** 2) > this.maxSwarmRadius) {
                slowBugs++;
            }
        });

        if (slowBugs === 0) { this.swarmClock++; }

        if (this.swarmClock === this.swarmTime) {
            this.swarmClock = 0;
            this.swarmTime = Math.floor(Math.random() * 50) + 10;
            const x = Math.floor(Math.random() * (this.dimension - 50)) - this.dimension / 2;
            const y = Math.floor(Math.random() * (this.dimension - 50)) - this.dimension / 2;
            this.target = {x,y};
        }
    }

    updateBug(bug) {
        const start = bug.center;
        const { target } = this;
        let modX = 0, modY = 0;
        if (Math.sqrt((target.x - start.x) ** 2 + (target.y - start.y) ** 2) > this.maxSwarmRadius / 4) {
            if (start.x != target.x) {
                if (start.x < target.x) modX = 1;
                else modX = -1;
            }
            if (start.y != target.y) {
                if (start.y < target.y) modY = 1;
                else modY = -1;
            }
            bug.center.x += modX * bug.velocity;
            bug.center.y += modY * bug.velocity;
        }
        
        bug.radius += 0.1 * bug.jitter[0];
        if (Math.abs(bug.radius) > this.maxSwarmRadius || Math.random() > 0.99) {
            bug.jitter[0] *= -1;
        }
        bug.theta += 0.1 * bug.jitter[1];
        if (Math.random() > 0.99) {
            bug.jitter[1] *= -1;
        }
    }

    updateSwarm() {
        const { target } = this;
        if (this.swarm.center.x != target.x) {
            if (this.swarm.center.x < target.x) this.swarm.center.x += 1;
            else this.swarm.center.x += -1;
        }
        if (this.swarm.center.y != target.y) {
            if (this.swarm.center.y < target.y) this.swarm.center.y += 1;
            else this.swarm.center.y += -1;
        }
    }

    render(canopy) {
        const memoMap = this.memoizer.createMap(this.dimension, canopy);
        const half = this.dimension / 2;
        this.swarm.bugs.forEach(bug => {
            const x = Math.floor(bug.radius * Math.cos(bug.theta)) + bug.center.x + half;
            const y = Math.floor(bug.radius * Math.sin(bug.theta)) + bug.center.y + half;
            const d = Math.sqrt((this.target.x - bug.center.x) ** 2 + (this.target.y - bug.center.y) ** 2);
            if (_.inRange(x, 0, this.dimension) && _.inRange(y,0,this.dimension)) {
                const co = memoMap.mapCoords(x,y);
                if (_.inRange(co.led, 0, canopy.stripLength)) {
                    const alpha = d < this.maxSwarmRadius * 0.6 ? (this.maxSwarmRadius - d)/this.maxSwarmRadius : 0.4;
                    canopy.strips[co.strip].updateColor(co.led, this.values.color.withAlpha(alpha));
                }
            }
        });
    }

    serializeState() {
        return {
            swarm: this.swarm,
            swarmTime: this.swarmTime,
            swarmClock: this.swarmClock
        }
    }

    deserializeState(obj) {
        this.swarm = obj.swarm;
        this.swarmTime = obj.swarmTime;
        this.swarmClock = obj.swarmClock;
    }

}