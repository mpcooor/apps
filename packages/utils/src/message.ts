import { IRelayerMessage } from '@llama-wallet/types'

export function webSocketMessage(data: IRelayerMessage): string {
  return JSON.stringify(data)
}
