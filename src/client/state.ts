
import * as PubSub from 'pubsub-js';
import { IPatternActive } from '../types';
import events from './events';


// The global array of actively rendering patterns
export const patterns: IPatternActive[] = [];

// Empty out the current array and splice the new ones in
export const updatePatterns = (newPatterns: IPatternActive[]) => {
    patterns.splice(0, patterns.length, ...newPatterns);
    PubSub.publish(events.updatePatterns, patterns);
};
