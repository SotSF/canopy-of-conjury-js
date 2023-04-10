/**
 * Web sockets that communicate with the server
 */

import { w3cwebsocket as W3CWebSocket } from "websocket";
import { getPatternByName } from "@/patterns";
import { updatePatterns } from "@/state";
import { IPatternActive, PatternInstance } from "@/types";
import {
  ClientMessage,
  ServerMessage,
  MESSAGE_TYPE,
  Message,
} from "@/util/messaging";

const stateSocket = new W3CWebSocket("ws://localhost:3000/state");

// When the socket has opened, synchronize the state with the server's
stateSocket.onopen = () => {
  state.syncState();
};

/** Message sending */
const send = (message: Message) => {
  if (stateSocket.readyState === stateSocket.OPEN) {
    stateSocket.send(JSON.stringify(message));
  } else {
    const messageType = MESSAGE_TYPE[message.type];
    console.warn(`"Unable to send message ${messageType}, socket is not open"`);
  }
};

export const state = {
  addPattern: (id: string, instance: PatternInstance, order: number) => {
    const message: ClientMessage.AddPattern = {
      type: MESSAGE_TYPE.addPattern,
      state: instance.serialize(),
      id,
      order,
    };

    send(message);
  },

  clearPatterns: () => {
    const message: ClientMessage.ClearPatterns = {
      type: MESSAGE_TYPE.clearPatterns,
    };

    send(message);
  },

  removePattern: (patternId: string) => {
    const message: ClientMessage.RemovePattern = {
      type: MESSAGE_TYPE.removePattern,
      patternId,
    };

    send(message);
  },

  updateProps: (patternId: string, props: any) => {
    const message: ClientMessage.UpdateProps = {
      type: MESSAGE_TYPE.updateProps,
      patternId,
      props,
    };

    send(message);
  },

  /** Sends a request to synchronize state with the server */
  syncState: () => {
    const message: ClientMessage.SyncState = {
      type: MESSAGE_TYPE.syncState,
    };

    send(message);
  },
};

/** Message receiving */
const syncState = (message: ServerMessage.SyncState) => {
  const patterns = message.patterns.flatMap((pattern): IPatternActive[] => {
    const PatternClass = getPatternByName(pattern.name);

    if (!PatternClass) {
      console.error(`Unable to find pattern with name "${pattern.name}"`);
      return [];
    }

    // Instantiate the pattern with the provided props
    const instance = new PatternClass(pattern.state.props) as PatternInstance;
    instance.deserialize(pattern.state);

    return [
      {
        id: pattern.id,
        name: pattern.name,
        order: pattern.order,
        instance,
      },
    ];
  });

  updatePatterns(patterns);
};

stateSocket.onmessage = (event) => {
  let message;
  try {
    message = JSON.parse(event.data as string);
  } catch (e) {
    console.error("Unable to parse malformatted message!");
    return;
  }

  switch (message.type) {
    case MESSAGE_TYPE.syncState:
      syncState(message);
      break;
  }
};
