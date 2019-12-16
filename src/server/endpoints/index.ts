/**
 * The `/state` endpoint. This is a web socket endpoint that manages communication of state
 * parameters between clients and the server
 */

import * as _ from 'lodash';
import * as WebSocket from 'ws';

import { getPatternByType } from '../../patterns';
import { PatternInterface } from '../../types';
import { ClientMessage, ServerMessage, MESSAGE_TYPE } from '../../util/messaging';
import state from '../state';

import savePatternSet from './savePatternSet';


/** Adds a pattern to the set of active patterns */
const addPattern = (msg: ClientMessage.AddPattern) => {
    const type = msg.pattern.type;
    const PatternType: PatternInterface = getPatternByType(type);
    if (!PatternType) {
        console.error(`Unable to render pattern with invalid type: "${type}"`);
        return null;
    }

    const instance = new PatternType();
    instance.initialize(msg.pattern);
    state.addPattern(instance);
};

/** Removes a pattern from the set of active patterns */
const removePattern = (msg: ClientMessage.RemovePattern) => {
    state.removePattern(msg.patternId);

    // TODO: notify clients
};

/** Updates the property of an active pattern */
const updateProps = (msg: ClientMessage.UpdateProps) => {
    state.updateProps(msg.patternId, msg.props);

    // TODO: notify clients
};

/** A client is asking to sync their state with the server (happens at page load) */
const syncState = (ws: WebSocket) => {
    const message: ServerMessage.SyncState = {
        type: MESSAGE_TYPE.syncState,
        patterns: state.serializePatterns()
    };

    ws.send(JSON.stringify(message));
};

export default (ws: WebSocket, req) => {
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
            case MESSAGE_TYPE.clearPatterns:
                state.clearPatterns();
                break;
            case MESSAGE_TYPE.removePattern:
                removePattern(<ClientMessage.RemovePattern>msg);
                break;
            case MESSAGE_TYPE.syncState:
                syncState(ws);
                break;
            case MESSAGE_TYPE.updateProps:
                updateProps(<ClientMessage.UpdateProps>msg);
                break;
            case MESSAGE_TYPE.savePatternSet:
                savePatternSet(<ClientMessage.SavePatternSet>msg, ws);
                break;
        }

        // TODO: should clients be informed about the update?
    });
};
