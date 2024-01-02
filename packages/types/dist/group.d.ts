import { WebSocket as WorkerWebSocket } from '@cloudflare/workers-types/experimental';
export declare enum SessionDevice {
    EXTENSION = "extension",
    MOBILE = "mobile",
    SERVER = "server"
}
export declare enum SessionKind {
    KEYGEN = "keygen",
    SIGN = "sign"
}
export interface IDurableObjectClients {
    clientId: string;
    device?: SessionDevice;
    joined: boolean;
    partyIndex?: number;
    webSocket: WorkerWebSocket | WebSocket;
}
export interface IGroupSessionData {
    kind: SessionKind;
    parties: number;
    sessionId: string;
    threshold: number;
}
