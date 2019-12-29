import sanitizeFn = require('sanitize-filename');
import { SerializedPattern } from '../../types';

export const sanitizeFilename = (unsanitized: string) => sanitizeFn(unsanitized);
export const PATTERN_SET_DIR = './pattern_sets';

type PatternJson = Pick<SerializedPattern, 'props' | 'type'>;
export type PatternSetJson = {
  name: string
  patterns: PatternJson[]
};