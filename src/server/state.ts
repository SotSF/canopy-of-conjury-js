/**
 * The `/state` endpoint. This is a web socket endpoint that manages communication of state
 * parameters between clients and the server
 */

import * as _ from 'lodash';
import { getPatternClassFromInstance, getPatternByName } from '../patterns';
import { IPatternActive, PatternInstance, PatternInterface } from '../types';
import { ClientMessage, ServerMessage, MESSAGE_TYPE } from '../util/messaging';


// The set of patterns that will be rendered
export let patterns: IPatternActive[] = [];

/** Adds a pattern to the set of active patterns */
const addPattern = (msg: ClientMessage.AddPattern) => {
    const PatternType: PatternInterface = getPatternByName(msg.patternName);
    if (!PatternType) {
        console.error(`Unable to render pattern with invalid type: "${msg.patternName}"`);
        return null;
    }

    const newPattern = {
        id: msg.id,
        instance: new PatternType(Object.assign({}, msg.props)),
        order: msg.order,
        name: msg.patternName
    };

    patterns.push(newPattern);
    console.info(`New "${msg.patternName}" pattern created with id "${msg.id}"`);
};

/** Removes a pattern from the set of active patterns */
const removePattern = (msg: ClientMessage.RemovePattern) => {
    delete patterns[msg.patternId];

    const patternToRemove = _.find(patterns, { id: msg.patternId });
    const patternInterface = getPatternClassFromInstance(patternToRemove.instance);
    patterns = _.without(patterns, patternToRemove);

    console.info(`Pattern "${patternInterface.displayName}" (id "${msg.patternId}") removed`);

    // TODO: notify clients
};

/** Updates the property of an active pattern */
const updateProps = (msg: ClientMessage.UpdateProps) => {
    const pattern: IPatternActive = _.find(patterns, { id: msg.patternId });
    pattern.instance.updateProps(msg.props);
};

/** A client is asking to sync their state with the server (happens at page load) */
const syncState = (ws) => {
    const serialized = patterns.map(pattern => ({
        id: pattern.id,
        order: pattern.order,
        state: pattern.instance.serialize(),
        name: pattern.name
    }));

    const message: ServerMessage.SyncState = {
        type: MESSAGE_TYPE.syncState,
        patterns: serialized
    };

    ws.send(JSON.stringify(message));
};

export default (ws, req) => {
    ws.on('message', (rawMsg: string) => {
        let msg;
        try {
            msg = JSON.parse(rawMsg);
        } catch (e) {
            console.error('Unable to parse malformatted message!');
            return;
        }

        switch (msg.type) {
            case MESSAGE_TYPE.addPattern:
                addPattern(<ClientMessage.AddPattern>msg);
                break;
            case MESSAGE_TYPE.removePattern:
                removePattern(<ClientMessage.RemovePattern>msg);
                break;
            case MESSAGE_TYPE.updateProps:
                updateProps(<ClientMessage.UpdateProps>msg);
                break;
            case MESSAGE_TYPE.syncState:
                syncState(ws);
                break;
        }

        // TODO: should clients be informed about the update?
    });
};
