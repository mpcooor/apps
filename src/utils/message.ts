import { IRelayerMessage } from '@/types'

export function webSocketMessage(data: IRelayerMessage): string {
  return JSON.stringify(data)
}
