/**
 * Web sockets that communicate with the server
 */

import { w3cwebsocket as W3CWebSocket }  from 'websocket';
import * as PubSub from 'pubsub-js';

import { getPatternByType } from '../patterns';
import { PatternInstance } from '../types';
import { ClientMessage, ServerMessage, MESSAGE_TYPE, IMessage } from '../util/messaging';
import events from './events';
import { updatePatterns } from './state';


const stateSocket = W3CWebSocket('ws://localhost:3000/');

// When the socket has opened, synchronize the state with the server's
stateSocket.onopen = () => fetchState();


/*********************
 * Message receiving *
 *********************/
const syncState = (message: ServerMessage.SyncState) => {
    const patterns = message.patterns.map((pattern) => {
        const PatternClass = getPatternByType(pattern.type);

        // Instantiate the pattern with the provided props
        const instance = new PatternClass();
        instance.initialize(pattern);
        return instance;
    });

    updatePatterns(patterns);
};

const syncPatternSets = (message: ServerMessage.SyncPatternSets) =>
    PubSub.publish(events.syncPatternSets, message.patternSets);

stateSocket.onmessage = (event) => {
    let message: IMessage;
    try {
        message = JSON.parse(event.data);
    } catch (e) {
        console.error('Unable to parse malformatted message!');
        return;
    }

    switch (message.type) {
        case MESSAGE_TYPE.syncState:
            syncState(<ServerMessage.SyncState>message);
            break;
        case MESSAGE_TYPE.syncPatternSets:
            syncPatternSets(<ServerMessage.SyncPatternSets>message);
    }
};


/*******************
 * Message sending *
 *******************/
const send = (message: IMessage) => {
    // Wait for the socket to be in its OPEN state
    if (stateSocket.readyState === 1) {
        stateSocket.send(JSON.stringify(message));
    } else {
        setTimeout(() => send(message), 500);
    }
};

/** Adds a pattern to the list of active patterns */
const addPattern = (pattern: PatternInstance) => {
    const message: ClientMessage.AddPattern = {
        type: MESSAGE_TYPE.addPattern,
        pattern: pattern.serialize()
    };

    send(message);
};

/** Clears all active patterns */
const clearPatterns = () => {
    const message: ClientMessage.ClearPatterns = {
        type: MESSAGE_TYPE.clearPatterns,
    };

    send(message);
};

/** Removes a single pattern from the active patterns list */
const removePattern = (patternId: string) => {
    const message: ClientMessage.RemovePattern = {
        type: MESSAGE_TYPE.removePattern,
        patternId
    };

    send(message);
};

/** Updates an active pattern's props */
const updateProps = (patternId: string, props: any) => {
    const message: ClientMessage.UpdateProps = {
        type: MESSAGE_TYPE.updateProps,
        patternId,
        props
    };

    send(message);
};

/** Sends a request to synchronize state with the server */
const fetchState = () => {
    const message: ClientMessage.SyncState = {
        type: MESSAGE_TYPE.syncState
    };

    send(message);
};

const fetchPatternSets = () => {
  const message: ClientMessage.SyncPatternSets = {
      type: MESSAGE_TYPE.syncPatternSets
  };

  send(message);
};

/** Sends a request to save the current pattern set */
const savePatternSet = (name: string, confirmOverride: boolean = false) => {
    const message: ClientMessage.SavePatternSet = {
        type: MESSAGE_TYPE.savePatternSet,
        name,
        confirmOverride
    };

    send(message);
};

const applyPatternSet = (name: string) => {
    const message: ClientMessage.ApplyPatternSet = {
        type: MESSAGE_TYPE.applyPatternSet,
        name
    };

    send(message);
};

export default {
    addPattern,
    applyPatternSet,
    removePattern,
    clearPatterns,
    updateProps,
    fetchState,
    fetchPatternSets,
    savePatternSet
};
