export declare function cryptoKeyToHex(key: CryptoKey): Promise<string | undefined>;
export declare function signCryptoKeyFromHex(hexKey: string, isPrivateKey: boolean): Promise<CryptoKey>;
export declare function syncCryptoKeyFromHex(hexKey: string, isPrivateKey: boolean): Promise<CryptoKey>;
export declare function generateSignKey(): Promise<{
    privateKey: CryptoKey;
    publicKey: CryptoKey;
}>;
export declare function generateKeyExchangeKey(): Promise<{
    privateKey: CryptoKey;
    publicKey: CryptoKey;
}>;
export declare function generateSignature(privateKey: CryptoKey, data: BufferSource): Promise<string>;
export declare function verifySignature(publicKey: CryptoKey, signature: string, message: Uint8Array): Promise<boolean>;
export declare function deriveKey(privateKey: CryptoKey | undefined, publicKey: CryptoKey): Promise<CryptoKey | undefined>;
export declare function deriveKeyFromHex(key: string): Promise<CryptoKey>;
