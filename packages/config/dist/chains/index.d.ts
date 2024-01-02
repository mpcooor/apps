import { ChainId, IChain } from '@llama-wallet/types';
import { Chain } from 'viem';
import { ethereum, sepolia } from './chains';
export declare const defaultChains: Record<ChainId, IChain>;
export declare const chainToViemChain: (chain: IChain) => Chain;
export { ethereum, sepolia };
