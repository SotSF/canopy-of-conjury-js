
/** Constants */
export const enum MESSAGE_TYPE {
    addPattern,
    removePattern,
    updateProps
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
