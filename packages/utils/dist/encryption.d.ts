export interface IEncryptedVault {
    cipherText: string;
    initializationVector: string;
    salt: string;
}
export interface ISaltedKey {
    key: CryptoKey;
    salt: string;
}
export declare function deriveSymmetricKeyFromPassword(password: string, extractable?: boolean, existingSalt?: string): Promise<ISaltedKey | undefined>;
export declare function encryptVault(vault: string, passwordOrSaltedKey: string | ISaltedKey): Promise<IEncryptedVault | undefined>;
export declare function decryptVault(vault: IEncryptedVault, passwordOrSaltedKey: string | ISaltedKey): Promise<string | undefined>;
