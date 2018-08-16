
import { IPatternState } from '../types';


/** Constants */
export const enum MESSAGE_TYPE {
    addPattern,
    removePattern,
    updateProps,
    syncState
}


/** Basic message interface */
interface IMessage {
    type: MESSAGE_TYPE
}


/** Messages from the client */
export namespace ClientMessage {
    export type SyncState = IMessage;

    export interface AddPattern extends IMessage {
        id: string
        order: number
        patternName: string
        props: any
    }

    export interface RemovePattern extends IMessage {
        patternId: string
    }

    export interface UpdateProps extends IMessage {
        patternId: string
        props: any // TODO: make this type more precise...
    }
}


/** Responses from the server */
export type response = any;

export namespace ServerMessage {
    interface IPatternWrapper {
        id: string
        order: number
        state: IPatternState
        name: string
    }

    export interface SyncState extends IMessage {
        patterns: IPatternWrapper[]
    }
}
