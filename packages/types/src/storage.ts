export const currentStorageVersion = 100000000

export interface IStorageMetadata {
  clientKeys: Record<string, string>
  encryptSecret?: string
  encrypted: boolean
  groupId?: string
  hash?: string
  salt?: string
  signKey: { privateKey?: string; publicKey?: string }
  version: number
}

export enum StorageKeys {
  STORAGE_METADATA = 'llama_wallet_storage_metadata',
  STORAGE_KEYS = 'llama_wallet:storage_keys:',
  STORAGE_PRESIGNS = 'llama_wallet:storage_presigns:',
  STORAGE_KEYS_LIST = 'llama_wallet:storage_keys_list',
  STORAGE_KEYS_DELETED_LIST = 'llama_wallet:storage_keys_deleted_list',
  STORAGE_PRESIGN_LIST = 'llama_wallet:storage_presigns_list'
}
