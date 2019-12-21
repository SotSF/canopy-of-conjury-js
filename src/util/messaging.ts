
import { SerializedActivePattern } from '../types';


/** Constants */
export const enum MESSAGE_TYPE {
    addPattern,
    applyPatternSet,
    clearPatterns,
    removePattern,
    updateProps,
    syncState,
    syncPatternSets,
    savePatternSet
}


/** Basic message interface */
export interface IMessage {
    type: MESSAGE_TYPE
}


/** Messages from the client */
export namespace ClientMessage {
    export type SyncState = IMessage;
    export type ClearPatterns = IMessage;
    export type SyncPatternSets = IMessage;

    export interface ApplyPatternSet extends IMessage {
        name: string
    }

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
    export interface SyncState extends IMessage {
        patterns: SerializedActivePattern[]
    }

    export interface SyncPatternSets extends IMessage {
        patternSets: string[]
    }

    export interface SavePatternSet extends IMessage {
        success: boolean
        needsConfirmation?: boolean
        error?: string
    }
}
