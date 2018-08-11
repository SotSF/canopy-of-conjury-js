
import * as _ from 'lodash';
import * as PubSub from 'pubsub-js';
import { IOscillator } from '../../types';
import * as util from '../../util';


let oscillatorCount = 0;

export default class Oscillator implements IOscillator {
    waveFunction = null;
    theta = 0;

    private subscribers = [];
    private id = oscillatorCount++;
    private readonly interval = null;

    constructor (waveFunction) {
        this.waveFunction = waveFunction;
        this.interval = setInterval(this.update, 10);
    }

    private update = () => {
        this.theta += 0.1;
        PubSub.publish(this.event, this.value);
    };

    private get event () {
        return `oscillator.${this.id}`;
    }

    get value () {
        return this.waveFunction(this.theta);
    }

    scaled (min, max) {
        return util.scale(this.value, -1, 1, min, max);
    }

    subscribe (fn) {
        const token = PubSub.subscribe(this.event, (msg, value) => fn(value));
        this.subscribers.push(token);
        return token;
    }

    unsubscribe (token) {
        PubSub.unsubscribe(token);

        // If there are no more subscribers, clear the interval so the oscillator can be garbage
        // collected
        this.subscribers = _.without(this.subscribers, token);
        if (this.subscribers.length === 0) clearInterval(this.interval);
    }
}
