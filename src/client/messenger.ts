/**
 * Web sockets that communicate with the server
 */

import { w3cwebsocket as W3CWebSocket }  from 'websocket';
import { PatternInterface } from '../types';
import { AddPatternMessage, MESSAGE_TYPE } from '../util/messaging';

const stateSocket = new W3CWebSocket('ws://localhost:3000/state');

export const state = {
    addPattern: (pattern: PatternInterface, props) => {
        const message: AddPatternMessage = {
            type: MESSAGE_TYPE.addPattern,
            patternName: pattern.displayName,
            props
        };

        stateSocket.send(JSON.stringify(message));
    }
};
