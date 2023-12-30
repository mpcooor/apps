import { WebSocket as WorkerWebSocket } from '@cloudflare/workers-types/experimental'

export enum SessionDevice {
  EXTENSION = 'extension',
  MOBILE = 'mobile',
  SERVER = 'server'
}

export enum SessionKind {
  KEYGEN = 'keygen',
  SIGN = 'sign'
}

export interface IDurableObjectClients {
  clientId: string
  device?: SessionDevice
  joined: boolean
  partyIndex?: number
  webSocket: WorkerWebSocket | WebSocket
}

export interface IGroupSessionData {
  kind: SessionKind
  parties: number
  sessionId: string
  threshold: number
}
