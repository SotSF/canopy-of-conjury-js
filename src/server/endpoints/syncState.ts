
import * as WebSocket from 'ws';
import { ServerMessage, MESSAGE_TYPE } from '../../util/messaging';
import state from '../state';

/** A client is asking to sync their state with the server (happens at page load) */
export default (ws: WebSocket) => {
  const message: ServerMessage.SyncState = {
      type: MESSAGE_TYPE.syncState,
      patterns: state.serializePatterns()
  };

  ws.send(JSON.stringify(message));
};