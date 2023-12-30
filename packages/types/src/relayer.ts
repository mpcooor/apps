import { SessionDevice } from './group'

export enum RelayerEvent {
  SESSION_CREATE = 'session.create',
  SESSION_JOIN = 'session.join',
  SESSION_MESSAGE = 'session.message',
  SESSION_FINISH = 'session.finish',
  SESSION_SYNC = 'session.sync',
  SESSION_START = 'session.start'
}

export enum RelayerNotification {
  SESSION_CREATE_EVENT = 'session.create.event',
  SESSION_SIGNUP_EVENT = 'session.signup.event',
  SESSION_MESSAGE_EVENT = 'session.message.event',
  SESSION_CLOSED_EVENT = 'session.closed.event',
  SESSION_START_EVENT = 'session.start.event'
}

export enum RelayerError {
  ERROR_CLIENT_DEVICE_NOT_JOINED = 'client for the specified device is not inside the session',
  ERROR_CLIENT_NOT_FOUND = 'client data is not found',
  ERROR_CLIENT_NOT_JOINED = 'client is not inside the session',
  ERROR_INVALID_PARAMS = 'invalid params',
  ERROR_PARTIES_TOO_SMALL = 'parties must be greater than one',
  ERROR_SESSION_DOES_NOT_EXIST = 'session does not exist',
  ERROR_SESSION_STARTED = 'unable to start a new session when a session is already started',
  ERROR_THRESHOLD_RANGE = 'threshold must be less than parties',
  ERROR_THRESHOLD_TOO_SMALL = 'threshold must be greater than zero',
  ERROR_UNKNOWN_METHOD = 'unknown method',
  ERROR_INTERNAL = 'internal server error',
  ERROR_SESSION_FULL = 'the session is full'
}

export interface IRelayerMessage {
  error?: { code: number; message: RelayerError }
  method?: RelayerEvent | RelayerNotification
  // biome-ignore lint/suspicious/noExplicitAny: params can be any kind and validated later.
  params?: any[]
  receiver?: SessionDevice
  sender?: SessionDevice
}
