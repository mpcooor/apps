export declare enum ChainId {
    ETHEREUM = 1,
    SEPOLIA = 11155111
}
export interface IChain {
    blockExplorer: {
        name: string;
        url: string;
    };
    chainId: ChainId;
    ensRegistry: {
        address: string;
    };
    ensUniversalResolver: {
        address: string;
        blockCreated: number;
    };
    httpUrl: string[];
    logoUri: string;
    multicall3: {
        address: string;
        blockCreated: number;
    };
    name: string;
    nativeCurrency: {
        decimals: number;
        name: string;
        symbol: string;
    };
    network: string;
    testnet: boolean;
    wssUrl: string[];
}
