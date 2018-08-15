/**
 * The `/state` endpoint. This is a web socket endpoint that manages communication of state
 * parameters between clients and the server
 */

import * as _ from 'lodash';
import { allPatterns } from '../patterns';
import { PatternInstance, PatternInterface } from '../types';
import {
    message,
    AddPatternMessage,
    RemovePatternMessage,
    UpdatePropMessage,
    MESSAGE_TYPE
} from '../util/messaging';


// The set of patterns that will be rendered
export const patterns = {};

/** Takes the display name of a pattern and returns the pattern class */
const getPatternByName = (name: string) => {
    for (let i = 0; i < allPatterns.length; i++) {
        if (allPatterns[i].displayName === name) {
            return allPatterns[i];
        }
    }

    // Didn't find a pattern with the given name
    return null;
};

/** Creates a unique ID for a pattern instance */
const makePatternId = (): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return _.range(20).map(() => _.sample(characters)).join('');
};

/** Adds a pattern to the set of active patterns */
const addPattern = (msg: AddPatternMessage) => {
    const PatternType: PatternInterface = getPatternByName(msg.patternName);
    if (!PatternType) {
        console.error(`Unable to render pattern with invalid type: "${msg.patternName}"`);
        return null;
    }

    const newPattern = new PatternType();
    newPattern.updateProps(msg.props);

    const id = makePatternId();
    patterns[id] = newPattern;

    console.info(`New "${msg.patternName}" pattern created with id "${id}"`);
    return id;
};

/** Removes a pattern from the set of active patterns */
const removePattern = (msg: RemovePatternMessage) => {
    delete patterns[msg.patternId];
};

/** Updates the property of an active pattern */
const updateProp = (msg: UpdatePropMessage) => {
    const pattern: PatternInstance = patterns[msg.patternId];
    pattern.updateProps({ [msg.prop]: msg.value });
};

export default (ws, req) => {
    ws.on('message', (rawMsg: string) => {
        let msg: message;
        try {
            msg = JSON.parse(rawMsg);
        } catch (e) {
            console.error('Unable to parse malformatted message!');
            return;
        }

        switch (msg.type) {
            case MESSAGE_TYPE.addPattern:
                addPattern(<AddPatternMessage>msg);
                break;
            case MESSAGE_TYPE.removePattern:
                removePattern(<RemovePatternMessage>msg);
                break;
            case MESSAGE_TYPE.updateProp:
                updateProp(<UpdatePropMessage>msg);
                break;
        }

        // TODO: should clients be informed about the update?
    });
};
