import { relayerServerUrl } from '@llama-wallet/config'
import {
  IClientData,
  IKeyShare,
  IMessage,
  IRelayerMessage,
  ISessionData,
  RelayerEvent,
  RelayerNotification,
  SessionDevice,
  SessionKind
} from '@llama-wallet/types'
import {
  generateSignature,
  roundKeygenFromString,
  roundKeygenToString,
  signCryptoKeyFromHex,
  stringToBuffer,
  verifySignature,
  webSocketMessage
} from '@llama-wallet/utils'
import { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react'

import { KeyGenerator, Signer } from '../wasm'
import { IEcdsaWorker } from '../worker'

const mpcContext = createContext<IMpcProvider | null>(null)

export function useMpc() {
  return useContext(mpcContext)
}

export interface IMpcProvider {
  createWallet: (parties: number, threshold: number) => Promise<void>
  initialized: boolean
}

export function MpcProvider({
  children,
  device,
  worker,
  groupId,
  signKey,
  onNewKey,
  clientKeys
}: {
  children: JSX.Element
  clientKeys: Record<SessionDevice, string> | undefined
  device: SessionDevice
  groupId: string | undefined
  onNewKey: (key: IKeyShare) => void
  signKey: { privateKey: string; publicKey: string } | undefined
  worker: IEcdsaWorker
}) {
  const [session, setSession] = useState<ISessionData | undefined>(undefined)
  const sessionRef = useRef(session);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const [keygen, setKeygen] = useState<KeyGenerator | undefined>(undefined)
  const keygenRef = useRef(keygen);

  useEffect(() => {
    keygenRef.current = keygen;
  }, [keygen]);

  const [, setSigner] = useState<Signer | undefined>(undefined)

  const [webSocket, setWebSocket] = useState<WebSocket | undefined>(undefined)

  const [connected, setConnected] = useState(false)

  const [initialized, setInitialized] = useState(false)

  const [client, setClient] = useState<IClientData>({ device });
  const clientRef = useRef(client);

  useEffect(() => {
    clientRef.current = client;
    console.log('client changed', clientRef.current)
  }, [client]);

  const verifyMessage = useCallback(
    async (sender: SessionDevice, message: string, signature: string): Promise<boolean> => {
      if (!clientKeys) return false

      try {
        const rawPublicKey = clientKeys[sender]

        const publicKey = await signCryptoKeyFromHex(rawPublicKey, false)

        const buffer = stringToBuffer(message)

        return await verifySignature(publicKey, signature, buffer)
      } catch (e) {
        console.error(e)
        return false
      }
    },
    [clientKeys]
  )

  const signMessage = useCallback(
    async (message: IMessage): Promise<{ rawMessage: string; signature: string } | undefined> => {
      if (!signKey || !signKey.privateKey) return

      try {
        const rawMessage = roundKeygenToString(message)
        if (!rawMessage) return

        const buffer = stringToBuffer(rawMessage)

        const privateKey = await signCryptoKeyFromHex(signKey.privateKey, true)

        const signature = await generateSignature(privateKey, buffer)

        return { rawMessage, signature }
      } catch (e) {
        console.error(e)
      }
    },
    [signKey]
  )

  const waitForSocketConnect = async () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (connected) {
          clearInterval(interval)
          console.log("waitForSocketConnect completed")
          resolve()
        }
      }, 50)
    })
  }

  

  const waitForSessionInit = async () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (sessionRef.current) {
          clearInterval(interval)
          console.log("waitForSessionInit completed")
          resolve()
        }
      }, 50)
    })
  }



  const waitForSessionClients = async () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!sessionRef.current) {
          clearInterval(interval)
          console.log("waitForSessionClients – no session available")
          resolve()

          return
        }

        if (Object.keys(sessionRef.current.clients).length >= sessionRef.current.required) {
          clearInterval(interval)
          console.log("waitForSessionClients completed")
          resolve()
        }
      }, 50)
    })
  }

  const waitToFinishProcessing = useCallback(async () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!session) {
          clearInterval(interval)
          resolve()

          return
        }

        if (!session.processing) {
          clearInterval(interval)
          resolve()
        }
      }, 50)
    })
  }, [session])

  const waitForRoundEnd = useCallback(async () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(async () => {
        if (!session) {
          clearInterval(interval);
          resolve();
          return;
        }

        if (session.round >= session.roundsRequired + 1) {
          try {
            if (!keygenRef.current || !webSocket) return;

            await keygenRef.current.proceed();

            const key = await keygenRef.current.create();

            webSocket.send(
              webSocketMessage({
                method: RelayerEvent.SESSION_FINISH,
                params: [session.sessionId]
              })
            );

            onNewKey(key);

            clearInterval(interval);
            resolve();
          } catch (e) {
            console.error(e);
            clearInterval(interval);
            resolve();
          }
        }
      }, 50);
    });
  }, [keygenRef, onNewKey, session, webSocket]);


  const handleSessionCreateEvent = useCallback(
    async (params: [SessionKind, number, number, string] | undefined) => {
      if (!webSocket || !params) return

      const [kind, parties, threshold, sessionId] = params

      const newSession = {
        clients: {},
        kind,
        messagesQueue: [],
        parties,
        processing: false,
        required: kind === SessionKind.KEYGEN ? parties - 1 : threshold,
        round: 1,
        roundsRequired: kind === SessionKind.KEYGEN ? 4 : 6,
        sessionId,
        threshold
      }

      setSession(newSession)
      console.log('session set called')
      await waitForSessionInit();
      console.log('session set success', session)
      webSocket.send(
        webSocketMessage({
          method: RelayerEvent.SESSION_JOIN,
          params: [sessionId, client.device]
        })
      )
    },
    [client.device, webSocket]
  )

  const handleSessionSignupEvent = useCallback(
    async (params: [string, SessionDevice, number] | undefined) => {
      console.log('handleSessionSignupEvent called with params:', { sessionRef, clientKeys, params });
      await waitForSessionInit();
      if (!sessionRef.current || !clientKeys || !params) {
        console.log('Early return due to missing session, clientKeys or params', {sessionRef, clientKeys, params});
        return;
      }

      const [clientId, device, partyIndex] = params;

      if (device === client.device) {
        console.log('Device matches client device. Updating client partyIndex and clientId');
        setClient({
          ...client,
          partyIndex: partyIndex,
          clientId: clientId
        });
      }

      console.log('Updating session clients with new client data');
      const updatedSession = {
        ...sessionRef.current,
        clients: {
          ...sessionRef.current.clients,
          [clientId]: {
            clientId,
            device,
            partyIndex,
            publicKey: clientKeys[device]
          }
        }
      };
      setSession(updatedSession);
    },
    [client, clientKeys, session]
  );

  const handleSessionCloseEvent = useCallback(async () => {
    await waitToFinishProcessing()

    setSession(undefined)
    setKeygen(undefined)
    setSigner(undefined)
  }, [waitToFinishProcessing])

  const handleSessionStart = useCallback(async () => {
    console.log('handleSessionStart', sessionRef.current,clientRef.current, webSocket)
    if (!sessionRef.current || !webSocket) return

    if (sessionRef.current.kind === SessionKind.KEYGEN) {
      console.log('worker key generater', worker.KeyGenerator, { parties: sessionRef.current.parties, threshold: sessionRef.current.threshold }, { number: clientRef.current.partyIndex, uuid: clientRef.current.clientId })
      // biome-ignore lint/suspicious/noExplicitAny: unable to convert between class and type
      const keygenInstance = await new (worker.KeyGenerator as any)(
        {
          parties: sessionRef.current.parties,
          threshold: sessionRef.current.threshold
        },
        { number: clientRef.current.partyIndex, uuid: clientRef.current.clientId }
      )

      console.log('keygen created', keygenInstance)

      const [, messages] = await keygenInstance.proceed()

      setKeygen(keygenInstance)

      console.log('keygen set')

      for (const message of messages) {
        const signedMessage = await signMessage(message)
        console.log('signed message', signedMessage)
        if (!signedMessage) return

        const { rawMessage, signature } = signedMessage

        webSocket.send(
          webSocketMessage({
            method: RelayerEvent.SESSION_MESSAGE,
            params: [sessionRef.current.sessionId, rawMessage, signature],
            sender: client.device
          })
        )
      }
    }

    waitForRoundEnd()
  }, [clientRef, sessionRef, signMessage, waitForRoundEnd, webSocket, worker.KeyGenerator])

  const handleSessionMessageEvent = useCallback(
    async (params: [string, string] | undefined, sender: SessionDevice | undefined) => {
      console.log('handleSessionMessageEvent called', { params, sender, session: sessionRef.current, keygen: keygenRef.current, webSocket, client });

      if (!params || !sessionRef.current || !keygenRef.current || !webSocket || !sender) return

      const [rawMessage, signature] = params

      if (sender !== client.device) {
        const valid = await verifyMessage(sender, rawMessage, signature)
        console.log('Message verification result:', valid);

        if (valid) {
          await waitToFinishProcessing()

          sessionRef.current.processing = true

          const message = roundKeygenFromString(rawMessage)
          if (!message) return

          sessionRef.current.messagesQueue.push(message)

          setSession({ ...sessionRef.current })
          console.log('Session after message added to queue:', sessionRef.current);

          if (sessionRef.current.messagesQueue.length >= sessionRef.current.required) {
            const messages = sessionRef.current.messagesQueue
            sessionRef.current.messagesQueue = []

            for (const message of messages) {
              await keygenRef.current.handleIncoming(message)
            }

            sessionRef.current.round++

            const [, newMessages] = await keygenRef.current.proceed()

            setKeygen(keygenRef.current)

            for (const message of newMessages) {
              if (message) {
                const signedMessage = await signMessage(message)
                if (!signedMessage) return

                const { rawMessage, signature } = signedMessage

                webSocket.send(
                  webSocketMessage({
                    method: RelayerEvent.SESSION_MESSAGE,
                    params: [sessionRef.current.sessionId, rawMessage, signature],
                    sender: client.device
                  })
                )
              }
            }
          }

          sessionRef.current.processing = false

          setSession({ ...sessionRef.current })
          console.log('Session after processing:', sessionRef.current);
        }
      }
    },
    [client, keygenRef, sessionRef, signMessage, verifyMessage, waitToFinishProcessing, webSocket]
  )

  const listen = useCallback(() => {
    console.log('listening', initialized, webSocket);
    if (!initialized || !webSocket) return

    webSocket.onopen = () => {
      console.log('websocket onopen')
      setConnected(true)
    }

    webSocket.onclose = () => {
      console.log('websocket onclose')
      setConnected(false)
    }

    webSocket.onerror = () => {
      console.log('websocket onerror')
      setConnected(false)
    }

    webSocket.onmessage = async ({ data }: MessageEvent) => {
      console.log('new websocket message', data);
      const { method, params, sender } = JSON.parse(data) as IRelayerMessage

      switch (method) {
        case RelayerNotification.SESSION_CREATE_EVENT:
          await handleSessionCreateEvent(params as [SessionKind, number, number, string])
          break

        case RelayerNotification.SESSION_SIGNUP_EVENT:
          await handleSessionSignupEvent(params as [string, SessionDevice, number])
          break

        case RelayerNotification.SESSION_MESSAGE_EVENT:
          await handleSessionMessageEvent(params as [string, string], sender)
          break

        case RelayerNotification.SESSION_CLOSED_EVENT:
          await handleSessionCloseEvent()
          break

        case RelayerNotification.SESSION_START_EVENT:
          await handleSessionStart()
          break
      }
    }
  }, [
    handleSessionCloseEvent,
    handleSessionCreateEvent,
    handleSessionMessageEvent,
    handleSessionSignupEvent,
    handleSessionStart,
    initialized,
    webSocket,
    session
  ])

  const initialize = useCallback(() => {

    console.log('mpc initialize, group id:', groupId);
    if (!groupId) return

    const webSocket = new WebSocket(relayerServerUrl + groupId)

    setWebSocket(webSocket)
    setInitialized(true)
  }, [groupId, session])

  useEffect(() => {
    if (webSocket) {
      listen();
    }
  }, [webSocket]); 

  // biome-ignore lint/correctness/useExhaustiveDependencies: require once to initialize the provider
  useEffect(() => {
    initialize()
  }, [])

  const createWallet = async (parties: number, threshold: number) => {
    console.log('createWallet called, current context:', {parties, threshold, webSocket, initialized, connected})
    if (!webSocket) return
    try {
      await waitForSocketConnect()
      webSocket.send(
        webSocketMessage({
          method: RelayerEvent.SESSION_CREATE,
          params: [parties, threshold, SessionKind.KEYGEN]
        })
      )

      await waitForSessionInit()

      await waitForSessionClients()

      webSocket.send(webSocketMessage({ method: RelayerEvent.SESSION_START }))
    } catch (e) {
      console.error(e)

      return
    }
  }

  return <mpcContext.Provider value={{ createWallet, initialized }}>{children}</mpcContext.Provider>
}
