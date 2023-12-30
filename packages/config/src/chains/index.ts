import { ChainId, IChain } from '@llama-wallet/types'
import { Chain, defineChain } from 'viem'

import { ethereum, sepolia } from './chains'

export const defaultChains: Record<ChainId, IChain> = {
  [ChainId.ETHEREUM]: ethereum,
  [ChainId.SEPOLIA]: sepolia
}

export const chainToViemChain = (chain: IChain): Chain => {
  return defineChain({
    id: chain.chainId,
    name: chain.name,
    nativeCurrency: {
      decimals: chain.nativeCurrency.decimals,
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol
    },
    network: chain.network,
    rpcUrls: {
      default: {
        http: chain.httpUrl,
        webSocket: chain.wssUrl
      },
      public: {
        http: chain.httpUrl,
        webSocket: chain.wssUrl
      }
    },
    testnet: chain.testnet
  })
}

export { ethereum, sepolia }
