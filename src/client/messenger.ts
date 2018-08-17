/**
 * Web sockets that communicate with the server
 */

import { w3cwebsocket as W3CWebSocket }  from 'websocket';
import { getPatternByName } from '../patterns';
import { updatePatterns } from './state';
import { PatternInstance } from '../types';
import {
    ClientMessage,
    ServerMessage,
    MESSAGE_TYPE,
} from '../util/messaging';


const stateSocket = new W3CWebSocket('ws://localhost:3000/state');

// When the socket has opened, synchronize the state with the server's
stateSocket.onopen = () => {
    state.syncState();
};


/** Message sending */
const send = message => stateSocket.send(JSON.stringify(message));
export const state = {
    addPattern: (id, pattern: PatternInstance, props, order) => {
        const message: ClientMessage.AddPattern = {
            type: MESSAGE_TYPE.addPattern,
            state: pattern.serialize(),
            id,
            order
        };

        send(message);
    },

    removePattern: (patternId: string) => {
        const message: ClientMessage.RemovePattern = {
            type: MESSAGE_TYPE.removePattern,
            patternId
        };

        send(message);
    },

    updateProps: (patternId: string, props: any) => {
        const message: ClientMessage.UpdateProps = {
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
        const instance = new PatternClass(pattern.state.props);
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
