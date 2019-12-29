/**
 * The `/state` endpoint. This is a web socket endpoint that manages communication of state
 * parameters between clients and the server
 */

import * as _ from 'lodash';
import * as WebSocket from 'ws';

import { ClientMessage, MESSAGE_TYPE, IMessage } from '../../util/messaging';
import state from '../state';

import addPattern from './addPattern';
import applyPatternSet from './applyPatternSet';
import savePatternSet from './savePatternSet';
import syncPatternSets from './syncPatternSets';
import syncState from './syncState';


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

export default (ws: WebSocket, req) => {
    ws.on('message', (rawMsg: string) => {
        let msg: IMessage;
        try {
            msg = JSON.parse(rawMsg);
        } catch (e) {
            console.error('Unable to parse malformatted message!');
            return;
        }

        switch (msg.type) {
            case MESSAGE_TYPE.addPattern:
                addPattern((<ClientMessage.AddPattern>msg).pattern);
                break;
            case MESSAGE_TYPE.applyPatternSet:
                applyPatternSet(<ClientMessage.ApplyPatternSet>msg, ws);
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
            case MESSAGE_TYPE.syncPatternSets:
                syncPatternSets(<ClientMessage.SyncPatternSets>msg, ws);
                break;
            case MESSAGE_TYPE.savePatternSet:
                savePatternSet(<ClientMessage.SavePatternSet>msg, ws);
                break;
        }
    });
};
