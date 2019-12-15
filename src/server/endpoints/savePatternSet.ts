
import * as WebSocket from 'ws';
import * as fs from 'fs';
import sanitizeFilename = require('sanitize-filename');

import { ClientMessage, ServerMessage, MESSAGE_TYPE } from '../../util/messaging';
import state from '../state';


const PATTERN_SET_DIR = './pattern_sets';

/**
 * Saves the current set of patterns to the local pattern set directory
 */
export default async (msg: ClientMessage.SavePatternSet, ws: WebSocket) => {
  // Check if there's already a pattern set with the given name. If there is
  // then the user is required to confirm the override.
  const preExisting: boolean = await patternSetExists(msg.name);
  if (preExisting && !msg.confirmOverride) {
    const response: ServerMessage.SavePatternSet = {
      type: MESSAGE_TYPE.savePatternSet,
      success: false,
      needsConfirmation: true
    };

    ws.send(JSON.stringify(response));
    return;
  }

  // No name conflict (or user has confirmed the override). Save the file
  try {
    await writePatternSet(msg.name);
  } catch (e) {
    const response: ServerMessage.SavePatternSet = {
      type: MESSAGE_TYPE.savePatternSet,
      success: false,
      error: e.toString()
    };

    ws.send(JSON.stringify(response));
    return;
  }

  // Success
  const response: ServerMessage.SavePatternSet = {
    type: MESSAGE_TYPE.savePatternSet,
    success: true
  };

  ws.send(JSON.stringify(response));
};


/**
 * Checks if a pattern set with the given name already exists
 */
const patternSetExists = (name: string): Promise<boolean> =>
  new Promise<boolean>((resolve, reject) => {
    fs.stat(PATTERN_SET_DIR, (err) => {
      // If the error code is "not exists", make the directory
      if (err && err.errno === 34) {
        fs.mkdir(PATTERN_SET_DIR, reject);
      }
    });

    fs.readdir(PATTERN_SET_DIR, (err, files) => {
      if (err) reject(err);

      // Unable to load the files in the directory for some reason
      if (!files) reject();

      const sanitizedName = sanitizeFilename(name);
      files.forEach(file => {
        // If a file already exists with the (sanitized) name provided, then
        // a pattern set with this name exists.
        if (file.match(`^${sanitizedName}.json$`)) {
          resolve(true);
        }
      });

      // No matching pattern set
      resolve(false);
    });
  });

const writePatternSet = (name: string): Promise<void> => 
  new Promise<void>((resolve, reject) => {
    const serialized = state.serializePatterns();
    
    // Strip the `iteration` parameter
    serialized.forEach((serializedPattern) => {
      delete serializedPattern.state.iteration;
    });

    const json = {
      name,
      patterns: serialized
    };

    const sanitized = sanitizeFilename(name);
    const fullPath = [PATTERN_SET_DIR, sanitized].join('/');
    const data = JSON.stringify(json, null, 2);

    fs.writeFile(fullPath, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
