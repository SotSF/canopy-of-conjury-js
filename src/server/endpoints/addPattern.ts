
import { getPatternByType } from '../../patterns';
import { PatternInterface } from '../../types';
import { SerializedPattern } from '../../types';
import state from '../state';

/** Adds a pattern to the set of active patterns */
export default (pattern: Partial<SerializedPattern>) => {
  const type = pattern.type;
  const PatternType: PatternInterface = getPatternByType(type);
  if (!PatternType) {
      console.error(`Unable to render pattern with invalid type: "${type}"`);
      return null;
  }

  const instance = new PatternType();
  instance.initialize(pattern);
  state.addPattern(instance);
};
