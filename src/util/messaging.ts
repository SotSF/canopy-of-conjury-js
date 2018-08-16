
import { IPatternState } from '../types';


/** Constants */
export const enum MESSAGE_TYPE {
    addPattern,
    removePattern,
    updateProps,
    syncState
}


/** Messages from the client */
interface IMessage {
    type: MESSAGE_TYPE
}

export interface AddPatternMessage extends IMessage {
    id: string
    order: number
    patternName: string
    props: any
}

export interface RemovePatternMessage extends IMessage {
    patternId: string
}

export interface UpdatePropsMessage extends IMessage {
    patternId: string
    props: any // TODO: make this type more precise...
}

export type message = AddPatternMessage | RemovePatternMessage | UpdatePropsMessage;


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
