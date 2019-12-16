
import * as _ from 'lodash';

import { getPatternClassFromInstance } from '../patterns';
import { PatternInstance, SerializedActivePattern } from '../types';


/**
 * Singleton class that tracks the state of the application
 */
class State {
    patterns: PatternInstance[] = [];

    addPattern (newPattern: PatternInstance) {
        this.patterns.push(newPattern);
        const type = getPatternClassFromInstance(newPattern).displayName;
        console.info(`New "${type}" pattern created with id "${newPattern.id}"`);
    }

    /** Removes a pattern from the set of active patterns */
    removePattern = (patternId: string) => {
        const patternToRemove = _.find(this.patterns, { id: patternId });
        this.patterns = _.without(this.patterns, patternToRemove);
    
        const patternInterface = getPatternClassFromInstance(patternToRemove);
        console.info(`Pattern "${patternInterface.displayName}" (id "${patternId}") removed`);
    };

    /** Clears all active patterns */
    clearPatterns () {
        this.patterns = [];
        console.info('Patterns cleared');
    }

    /** Updates the property of an active pattern */
    updateProps = (patternId: string, newProps) => {
      console.log(patternId);
      const pattern: PatternInstance = _.find(this.patterns, { id: patternId });
      pattern.updateProps(pattern.deserializeProps(newProps));
  
      const patternInterface = getPatternClassFromInstance(pattern);
      console.info(`Pattern "${patternInterface.displayName}" (id "${patternId}") props updated`);
  }

    /** Helper function for serializing the list of active patterns */
    serializePatterns (): SerializedActivePattern[] {
        return this.patterns.map(pattern => pattern.serialize());
    }
}

export default new State;