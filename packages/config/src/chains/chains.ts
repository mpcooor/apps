import { IChain } from '@llama-wallet/types'

export const ethereum: IChain = {
  blockExplorer: {
    name: 'Etherscan',
    url: 'https://etherscan.io'
  },
  chainId: 1,
  ensRegistry: {
    address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  },
  ensUniversalResolver: {
    address: '0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62',
    blockCreated: 16966585
  },
  httpUrl: ['https://eth.llamarpc.com'],
  logoUri: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
  multicall3: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 14353601
  },
  name: 'Ethereum',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  network: 'ethereum',
  testnet: false,
  wssUrl: ['wss://eth.llamarpc.com']
}

export const sepolia: IChain = {
  blockExplorer: {
    name: 'Etherscan',
    url: 'https://goerli.etherscan.io'
  },
  chainId: 11_155_111,
  ensRegistry: { address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' },
  ensUniversalResolver: {
    address: '0x21B000Fd62a880b2125A61e36a284BB757b76025',
    blockCreated: 3914906
  },
  httpUrl: ['https://rpc.sepolia.org'],
  logoUri: 'https://chainlist.org/unknown-logo.png',
  multicall3: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 751532
  },
  name: 'Sepolia',
  nativeCurrency: { decimals: 18, name: 'Sepolia Ether', symbol: 'SEP' },
  network: 'sepolia',
  testnet: true,
  wssUrl: []
}
