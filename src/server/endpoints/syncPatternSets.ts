
import * as WebSocket from 'ws';
import * as fs from 'fs';

import { ClientMessage, ServerMessage, MESSAGE_TYPE } from '../../util/messaging';
import { PATTERN_SET_DIR } from './util';


/**
 * Saves the current set of patterns to the local pattern set directory
 */
export default async (msg: ClientMessage.SyncPatternSets, ws: WebSocket) => {
  const patternSetNames = await loadPatternSets();
  const response: ServerMessage.SyncPatternSets = {
    type: MESSAGE_TYPE.syncPatternSets,
    patternSets: patternSetNames
  };

  ws.send(JSON.stringify(response));
};

/**
 * Loads all existing pattern sets
 */
const loadPatternSets = (): Promise<string[]> =>
  new Promise<string[]>((resolve, reject) => {
    fs.stat(PATTERN_SET_DIR, (err) => {
      // If the error code is "not exists", make the directory
      if (err && err.errno === 34) {
        fs.mkdir(PATTERN_SET_DIR, () => resolve([]));
      }
    });

    fs.readdir(PATTERN_SET_DIR, (err, files) => {
      if (err) reject(err);

      // Unable to load the files in the directory for some reason
      if (!files) reject();

      // Strip the `.json` suffix
      const patternSetNames = files.map((file) => {
        const match: RegExpMatchArray = file.match(/(?<fileName>.*)\.json/);
        return match.groups ? match.groups.fileName : file;
      });

      resolve(patternSetNames);
    });
  });
