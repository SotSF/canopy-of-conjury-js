
import * as _ from 'lodash';
import { PatternInstance, SerializedActivePattern } from '../types';
import BasePattern from '../patterns/BasePattern';


/**
 * Singleton class that tracks the state of the application
 */
class State {
    patterns: PatternInstance[] = [];

    addPattern (newPattern: PatternInstance) {
        this.patterns.push(newPattern);
        const type = newPattern.getClass().displayName;
        console.info(`New "${type}" pattern created with id "${newPattern.id}"`);
    }

    /** Removes a pattern from the set of active patterns */
    removePattern = (patternId: string) => {
        const patternToRemove = _.find(this.patterns, { id: patternId });
        this.patterns = _.without(this.patterns, patternToRemove);
        console.info(`Pattern "${patternToRemove.getClass().displayName}" (id "${patternId}") removed`);
    };

    /** Clears all active patterns */
    clearPatterns () {
        this.patterns = [];
        console.info('Patterns cleared');
    }

    /** Updates the property of an active pattern */
    updateProps = (patternId: string, newProps) => {
      const pattern: PatternInstance = _.find(this.patterns, { id: patternId });
      pattern.updateProps(pattern.deserializeProps(newProps));
      console.info(`Pattern "${pattern.getClass().displayName}" (id "${patternId}") props updated`);
  }

    /** Helper function for serializing the list of active patterns */
    serializePatterns (): SerializedActivePattern[] {
        return this.patterns.map(pattern => pattern.serialize());
    }
}

export default new State;