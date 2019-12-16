
import { SerializedActivePattern } from '../types';


/** Constants */
export const enum MESSAGE_TYPE {
    addPattern,
    clearPatterns,
    removePattern,
    updateProps,
    syncState,
    savePatternSet
}


/** Basic message interface */
interface IMessage {
    type: MESSAGE_TYPE
}


/** Messages from the client */
export namespace ClientMessage {
    export type SyncState = IMessage;
    export type ClearPatterns = IMessage;

    export interface AddPattern extends IMessage {
        pattern: SerializedActivePattern
    }

    export interface RemovePattern extends IMessage {
        patternId: string
    }

    export interface UpdateProps extends IMessage {
        patternId: string
        props: any // TODO: make this type more precise...
    }

    export interface SavePatternSet extends IMessage {
        name: string
        confirmOverride: boolean
    }
}


/** Responses from the server */
export type response = any;

export namespace ServerMessage {
    interface IPatternWrapper {
        id: string
        order: number
        state: SerializedActivePattern
        name: string
    }

    export interface SyncState extends IMessage {
        patterns: SerializedActivePattern[]
    }

    export interface SavePatternSet extends IMessage {
        success: boolean
        needsConfirmation?: boolean
        error?: string
    }
}
