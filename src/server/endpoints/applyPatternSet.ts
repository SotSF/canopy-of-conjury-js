
import * as WebSocket from 'ws';
import * as fs from 'fs';

import { ClientMessage } from '../../util/messaging';
import state from '../state';
import addPattern from './addPattern';
import syncState from './syncState';
import { sanitizeFilename, PATTERN_SET_DIR, PatternSetJson } from './util';


/**
 * Saves the current set of patterns to the local pattern set directory
 */
export default async (msg: ClientMessage.ApplyPatternSet, ws: WebSocket) => {
  let json: PatternSetJson = await loadPatternSet(msg.name, ws);

  // Clear what is currently being rendered, apply the patterns, and inform clients
  state.clearPatterns();
  json.patterns.forEach(addPattern);
  syncState(ws);

  console.info(`Pattern set "${msg.name}" applied`);
};

/**
 * Loads all existing pattern sets
 */
const loadPatternSet = (name: string, ws: WebSocket): Promise<PatternSetJson> =>
  new Promise<PatternSetJson>((resolve, reject) => {
    fs.stat(PATTERN_SET_DIR, (err) => {
      // If the error code is "not exists", hard fail
      if (err && err.errno === 34) {
        reject();
      }
    });

    const sanitized = `${sanitizeFilename(name)}.json`;
    const fullPath = [PATTERN_SET_DIR, sanitized].join('/');

    fs.readFile(fullPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Successfully loaded the file. Attempt to parse it
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        // Failed for some reason
        reject(e);
      }
    });
  });
