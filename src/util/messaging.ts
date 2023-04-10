import { IPatternState } from "../types";

/** Constants */
export enum MESSAGE_TYPE {
  addPattern,
  clearPatterns,
  removePattern,
  updateProps,
  syncState,
}

/** Basic message interface */
export type Message = {
  type: MESSAGE_TYPE;
};

/** Messages from the client */
export namespace ClientMessage {
  export type SyncState = Message;
  export type ClearPatterns = Message;

  export type AddPattern = Message & {
    id: string;
    order: number;
    state: IPatternState;
  };

  export type RemovePattern = Message & {
    patternId: string;
  };

  export type UpdateProps = Message & {
    patternId: string;
    props: any; // TODO: make this type more precise...
  };
}

/** Responses from the server */
export type response = any;

export namespace ServerMessage {
  export type SyncState = Message & {
    patterns: Array<{
      id: string;
      order: number;
      state: IPatternState;
      name: string;
    }>;
  };
}
