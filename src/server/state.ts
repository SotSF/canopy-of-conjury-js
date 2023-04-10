/**
 * The `/state` endpoint. This is a web socket endpoint that manages communication of state
 * parameters between clients and the server
 */

import _ from "lodash";
import * as ws from "ws";
import { getPatternClassFromInstance, getPatternByName } from "../patterns";
import { IPatternActive } from "../types";
import { ClientMessage, ServerMessage, MESSAGE_TYPE } from "../util/messaging";
import BasePattern from "@/patterns/BasePattern";

// The set of patterns that will be rendered
export let patterns: IPatternActive[] = [];

/** Adds a pattern to the set of active patterns */
const addPattern = (msg: ClientMessage.AddPattern) => {
  const name = msg.state.type;
  const PatternType = getPatternByName(name);
  if (!PatternType) {
    console.error(`Unable to render pattern with invalid type: "${name}"`);
    return null;
  }

  const instance = new PatternType({ ...msg.state.props });
  instance.deserialize(msg.state);

  const newPattern: IPatternActive = {
    id: msg.id,
    instance,
    order: msg.order,
    name,
  };

  patterns.push(newPattern);
  console.info(`New "${name}" pattern created with id "${msg.id}"`);
};

/** Clears all active patterns */
const clearPatterns = () => {
  patterns = [];
  console.info("Patterns cleared");
};

/** Removes a pattern from the set of active patterns */
const removePattern = (msg: ClientMessage.RemovePattern) => {
  const id = msg.patternId;
  const patternToRemove = _.find(patterns, { id });
  if (!patternToRemove) {
    console.error(`Unable to remove pattern with id "${id}"`);
    return;
  }

  patterns = _.without(patterns, patternToRemove);

  const patternClass = getPatternClassFromInstance(patternToRemove.instance);
  if (!patternClass) {
    console.error(`Unable to find pattern class for pattern with id "${id}"`);
  } else {
    console.info(`Pattern "${patternClass.displayName}" (id "${id}") removed`);
  }

  // TODO: notify clients
};

/** Updates the property of an active pattern */
const updateProps = (msg: ClientMessage.UpdateProps) => {
  const id = msg.patternId;
  const pattern = _.find(patterns, { id });
  if (!pattern) {
    console.error(`Unable to update props for pattern with id "${id}"`);
    return;
  }

  pattern.instance.updateProps(pattern.instance.deserializeProps(msg.props));
  const patternClass = getPatternClassFromInstance(pattern.instance);
  if (!patternClass) {
    console.error(`Unable to find pattern class for pattern with id "${id}"`);
  } else {
    console.info(
      `Pattern "${patternClass.displayName}" (id "${id}") props updated`
    );
  }
};

/** A client is asking to sync their state with the server (happens at page load) */
const syncState = (ws: ws) => {
  const serialized = patterns.map((pattern) => ({
    id: pattern.id,
    order: pattern.order,
    state: pattern.instance.serialize(),
    name: pattern.name,
  }));

  const message: ServerMessage.SyncState = {
    type: MESSAGE_TYPE.syncState,
    patterns: serialized,
  };

  ws.send(JSON.stringify(message));
};

export function handle(ws: ws) {
  ws.on("message", (rawMsg: string) => {
    let msg;
    try {
      msg = JSON.parse(rawMsg);
    } catch (e) {
      console.error("Unable to parse malformatted message!");
      return;
    }

    switch (msg.type) {
      case MESSAGE_TYPE.addPattern:
        addPattern(<ClientMessage.AddPattern>msg);
        break;
      case MESSAGE_TYPE.clearPatterns:
        clearPatterns();
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
    }

    // TODO: should clients be informed about the update?
  });
}
