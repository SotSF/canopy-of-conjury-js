
/** Constants */
export const enum MESSAGE_TYPE {
    addPattern,
    removePattern,
    updateProp
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

export interface UpdatePropMessage extends IMessage {
    patternId: string
    prop: string
    value: any
}

export type message = AddPatternMessage | RemovePatternMessage | UpdatePropMessage;


/** Responses from the server */

export type response = any;
