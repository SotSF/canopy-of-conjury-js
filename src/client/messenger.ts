/**
 * Web sockets that communicate with the server
 */

import { w3cwebsocket as W3CWebSocket }  from 'websocket';
import { getPatternByName } from '../patterns';
import { updatePatterns } from './state';
import { PatternInterface } from '../types';
import {
    ClientMessage,
    AddPatternMessage,
    RemovePatternMessage,
    UpdatePropsMessage,
    MESSAGE_TYPE, ServerMessage,
} from '../util/messaging';


const stateSocket = new W3CWebSocket('ws://localhost:3000/state');

// When the socket has opened, synchronize the state with the server's
stateSocket.onopen = () => {
    state.syncState();
};


/** Message sending */
const send = message => stateSocket.send(JSON.stringify(message));
export const state = {
    addPattern: (id, pattern: PatternInterface, props, order) => {
        const message: AddPatternMessage = {
            type: MESSAGE_TYPE.addPattern,
            patternName: pattern.displayName,
            props,
            id,
            order
        };

        send(message);
    },

    removePattern: (patternId: string) => {
        const message: RemovePatternMessage = {
            type: MESSAGE_TYPE.removePattern,
            patternId
        };

        send(message);
    },

    updateProps: (patternId: string, props: any) => {
        const message: UpdatePropsMessage = {
            type: MESSAGE_TYPE.updateProps,
            patternId,
            props
        };

        send(message);
    },

    /** Sends a request to synchronize state with the server */
    syncState: () => {
        const message: ClientMessage.SyncState = {
            type: MESSAGE_TYPE.syncState
        };

        send(message);
    }
};


/** Message receiving */
const syncState = (message: ServerMessage.SyncState) => {
    const patterns = message.patterns.map((pattern) => {
        const PatternClass = getPatternByName(pattern.name);

        // Instantiate the pattern with the provided props
        const instance = new PatternClass();
        instance.deserialize(pattern.state);

        return {
            id: pattern.id,
            name: pattern.name,
            order: pattern.order,
            instance,
        };
    });

    updatePatterns(patterns);
};

stateSocket.onmessage = (event) => {
    let message;
    try {
        message = JSON.parse(event.data);
    } catch (e) {
        console.error('Unable to parse malformatted message!');
        return;
    }

    switch (message.type) {
        case MESSAGE_TYPE.syncState:
            syncState(message);
            break;
    }
};
