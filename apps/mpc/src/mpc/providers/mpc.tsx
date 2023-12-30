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
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

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

  const [keygen, setKeygen] = useState<KeyGenerator | undefined>(undefined)

  const [, setSigner] = useState<Signer | undefined>(undefined)

  const [webSocket, setWebSocket] = useState<WebSocket | undefined>(undefined)

  const [connected, setConnected] = useState(false)

  const [initialized, setInitialized] = useState(false)

  const [client, setClient] = useState<IClientData>({ device })

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
          resolve()
        }
      }, 50)
    })
  }

  const waitForSessionInit = async () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (session) {
          clearInterval(interval)
          resolve()
        }
      }, 50)
    })
  }

  const waitForSessionClients = async () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!session) {
          clearInterval(interval)
          resolve()

          return
        }

        if (Object.keys(session.clients).length >= session.required) {
          clearInterval(interval)
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
          clearInterval(interval)
          resolve()
          return
        }

        if (session.round >= session.roundsRequired + 1) {
          try {
            if (!keygen || !webSocket) return

            await keygen.proceed()

            const key = await keygen.create()

            webSocket.send(
              webSocketMessage({
                method: RelayerEvent.SESSION_FINISH,
                params: [session.sessionId]
              })
            )

            onNewKey(key)

            clearInterval(interval)
            resolve()
          } catch (e) {
            console.error(e)
            clearInterval(interval)
            resolve()
          }
        }
      }, 50)
    })
  }, [keygen, onNewKey, session, webSocket])

  const handleSessionCreateEvent = useCallback(
    async (params: [SessionKind, number, number, string] | undefined) => {
      if (!webSocket || !params) return

      const [kind, parties, threshold, sessionId] = params

      const session = {
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

      setSession(session)

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
    (params: [string, SessionDevice, number] | undefined) => {
      if (!session || !clientKeys || !params) return

      const [clientId, device, partyIndex] = params

      if (device === client.device) {
        client.partyIndex = partyIndex
        client.clientId = clientId
        setClient(client)
      }

      session.clients[clientId] = {
        clientId,
        device,
        partyIndex,
        publicKey: clientKeys[device]
      }
      setSession(session)
    },
    [client, clientKeys, session]
  )

  const handleSessionCloseEvent = useCallback(async () => {
    await waitToFinishProcessing()

    setSession(undefined)
    setKeygen(undefined)
    setSigner(undefined)
  }, [waitToFinishProcessing])

  const handleSessionStart = useCallback(async () => {
    if (!session || !webSocket) return

    if (session.kind === SessionKind.KEYGEN) {
      // biome-ignore lint/suspicious/noExplicitAny: unable to convert between class and type
      const keygen = await new (worker.KeyGenerator as any)(
        {
          parties: session.parties,
          threshold: session.threshold
        },
        { number: client.partyIndex, uuid: client.clientId }
      )

      const [, messages] = await keygen.proceed()

      setKeygen(keygen)

      for (const message of messages) {
        const signedMessage = await signMessage(message)
        if (!signedMessage) return

        const { rawMessage, signature } = signedMessage

        webSocket.send(
          webSocketMessage({
            method: RelayerEvent.SESSION_MESSAGE,
            params: [session.sessionId, rawMessage, signature],
            sender: client.device
          })
        )
      }
    }

    waitForRoundEnd()
  }, [client, session, signMessage, waitForRoundEnd, webSocket, worker.KeyGenerator])

  const handleSessionMessageEvent = useCallback(
    async (params: [string, string] | undefined, sender: SessionDevice | undefined) => {
      if (!params || !session || !keygen || !webSocket || !sender) return

      const [rawMessage, signature] = params

      if (sender !== client.device) {
        const valid = await verifyMessage(sender, rawMessage, signature)

        if (valid) {
          await waitToFinishProcessing()

          session.processing = true

          const message = roundKeygenFromString(rawMessage)
          if (!message) return

          session.messagesQueue.push(message)

          setSession(session)

          if (session.messagesQueue.length >= session.required) {
            const messages = session.messagesQueue
            session.messagesQueue = []

            for (const message of messages) {
              await keygen.handleIncoming(message)
            }

            session.round++

            const [, newMessages] = await keygen.proceed()

            setKeygen(keygen)

            for (const message of newMessages) {
              if (message) {
                const signedMessage = await signMessage(message)
                if (!signedMessage) return

                const { rawMessage, signature } = signedMessage

                webSocket.send(
                  webSocketMessage({
                    method: RelayerEvent.SESSION_MESSAGE,
                    params: [session.sessionId, rawMessage, signature],
                    sender: client.device
                  })
                )
              }
            }
          }

          session.processing = false

          setSession(session)
        }
      }
    },
    [client, keygen, session, signMessage, verifyMessage, waitToFinishProcessing, webSocket]
  )

  const listen = useCallback(() => {
    if (!initialized || !webSocket) return

    webSocket.onopen = () => {
      setConnected(true)
    }

    webSocket.onclose = () => {
      setConnected(false)
    }

    webSocket.onerror = () => {
      setConnected(false)
    }

    webSocket.onmessage = async ({ data }: MessageEvent) => {
      const { method, params, sender } = JSON.parse(data) as IRelayerMessage

      switch (method) {
        case RelayerNotification.SESSION_CREATE_EVENT:
          await handleSessionCreateEvent(params as [SessionKind, number, number, string])
          break

        case RelayerNotification.SESSION_SIGNUP_EVENT:
          handleSessionSignupEvent(params as [string, SessionDevice, number])
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
    webSocket
  ])

  const initialize = useCallback(() => {
    if (!groupId) return

    const webSocket = new WebSocket(relayerServerUrl + groupId)
    listen()

    setWebSocket(webSocket)
    setInitialized(true)
  }, [groupId, listen])

  // biome-ignore lint/correctness/useExhaustiveDependencies: require once to initialize the provider
  useEffect(() => {
    initialize()
  }, [])

  const createWallet = async (parties: number, threshold: number) => {
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
