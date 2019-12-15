
import * as _ from 'lodash';

import { getPatternClassFromInstance } from '../patterns';
import { IPatternActive } from '../types';


/**
 * Singleton class that tracks the state of the application
 */
class State {
    patterns: IPatternActive[] = [];

    addPattern (newPattern) {
        this.patterns.push(newPattern);
        console.info(`New "${newPattern.name}" pattern created with id "${newPattern.id}"`);
    }

    /** Removes a pattern from the set of active patterns */
    removePattern = (patternId: string) => {
        const patternToRemove = _.find(this.patterns, { id: patternId });
        this.patterns = _.without(this.patterns, patternToRemove);
    
        const patternInterface = getPatternClassFromInstance(patternToRemove.instance);
        console.info(`Pattern "${patternInterface.displayName}" (id "${patternId}") removed`);
    };

    /** Clears all active patterns */
    clearPatterns () {
        this.patterns = [];
        console.info('Patterns cleared');
    }

    /** Updates the property of an active pattern */
    updateProps = (patternId: string, newProps) => {
      const pattern: IPatternActive = _.find(this.patterns, { id: patternId });
      pattern.instance.updateProps(pattern.instance.deserializeProps(newProps));
  
      const patternInterface = getPatternClassFromInstance(pattern.instance);
      console.info(`Pattern "${patternInterface.displayName}" (id "${patternId}") props updated`);
  }

    /** Helper function for serializing the list of active patterns */
    serializePatterns () {
        return this.patterns.map(pattern => ({
            id: pattern.id,
            order: pattern.order,
            state: pattern.instance.serialize(),
            name: pattern.name
        }));
    }
}

export default new State;