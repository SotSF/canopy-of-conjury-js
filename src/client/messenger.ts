/**
 * Web sockets that communicate with the server
 */

import { w3cwebsocket as W3CWebSocket }  from 'websocket';
import { PatternInterface } from '../types';
import {
    AddPatternMessage,
    RemovePatternMessage,
    UpdatePropsMessage,
    MESSAGE_TYPE,
} from '../util/messaging';


const stateSocket = new W3CWebSocket('ws://localhost:3000/state');

export const state = {
    addPattern: (id, pattern: PatternInterface, props, order) => {
        const message: AddPatternMessage = {
            type: MESSAGE_TYPE.addPattern,
            patternName: pattern.displayName,
            props,
            id,
            order
        };

        stateSocket.send(JSON.stringify(message));
    },

    removePattern: (patternId: string) => {
        const message: RemovePatternMessage = {
            type: MESSAGE_TYPE.removePattern,
            patternId
        };

        stateSocket.send(JSON.stringify(message));
    },

    updateProps: (patternId: string, props: any) => {
        const message: UpdatePropsMessage = {
            type: MESSAGE_TYPE.updateProps,
            patternId,
            props
        };

        stateSocket.send(JSON.stringify(message));
    }
};
