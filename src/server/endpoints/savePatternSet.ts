
import * as WebSocket from 'ws';
import * as fs from 'fs';

import { ClientMessage, ServerMessage, MESSAGE_TYPE } from '../../util/messaging';
import state from '../state';

const PATTERN_SET_DIR = './pattern_sets';


/**
 * Saves the current set of patterns to the local pattern set directory
 */
export default (msg: ClientMessage.SavePatternSet, ws: WebSocket) => {
    // Check if there's already a pattern set with the given name. If there is
    // then the user is required to confirm the override.
    if (patternSetExists(msg.name) && !msg.confirmOverride) {
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
        writePatternSet(msg.name);
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
const patternSetExists = (name: string): boolean => {
    fs.readdir(PATTERN_SET_DIR, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
    });
};

const writePatternSet = (name: string) => {
    const serialized = state.serializePatterns();
    
    // Strip the `iteration` parameter
    serialized.forEach((serializedPattern) => {
        const activePatternState = serializedPattern.state;
        const unactivePatternState = {
            ...activePatternState
        };

        delete unactivePatternState.iteration;
    });

    console.log(serialized);
};