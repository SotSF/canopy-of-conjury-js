
import * as PubSub from 'pubsub-js';
import { PatternInstance } from '../types';
import events from './events';


// The global array of actively rendering patterns
export const patterns: PatternInstance[] = [];

// Empty out the current array and splice the new ones in
export const updatePatterns = (newPatterns: PatternInstance[]) => {
    patterns.splice(0, patterns.length, ...newPatterns);
    PubSub.publish(events.updatePatterns, patterns);
};
