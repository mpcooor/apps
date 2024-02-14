import { IKeyShare, SessionDevice } from '@llama-wallet/types'
import { StrictMode, useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { MpcProvider, WorkerProvider, useWorker } from '@/mpc'
import { cryptoKeyToHex, decryptVault, deriveKey, deriveSymmetricKeyFromPassword, encryptVault, generateKeyExchangeKey, generateSignKey, hexToBuffer, signCryptoKeyFromHex, syncCryptoKeyFromHex, verifySignature } from '@llama-wallet/utils'

function Main() {
  /*   
  const sendMessage = (type: string, data: string) => {
    window.parent.postMessage({ data, type }, '*')
  } 
  */

  return <div />
}

async function executeCrypto({action, args}:{action:string, args:any}){
  if(action === "getEncodedKeyFromPassword"){
    const derivedKey = await deriveSymmetricKeyFromPassword(args.password, true, args.salt)
    if (!derivedKey) return null

    const encoded = await cryptoKeyToHex(derivedKey.key)
    return {hash:encoded, salt:derivedKey.salt}
  } else if (action === "verifySignature"){
    const key = await signCryptoKeyFromHex(args.extensionPublicKey, false)
    if (!key) return null

    const buffer = hexToBuffer(args.message)

    const valid = await verifySignature(key, args.signature, buffer)
    return valid
  } else if( action === "generateKeyExchangeKey"){
    const keys = await generateKeyExchangeKey()
    return {
      privateKey: await cryptoKeyToHex(keys.privateKey),
      publicKey: await cryptoKeyToHex(keys.publicKey)
    }
  } else if (action === "deriveKey"){
    const extensionEcdhPublicKeyParsed = await syncCryptoKeyFromHex(args.extensionEcdhPublicKey, false)

    const derived = await deriveKey(await syncCryptoKeyFromHex(args.privateKey, true), extensionEcdhPublicKeyParsed)
    if (!derived) return

    const encryptSecred = await cryptoKeyToHex(derived)
    return encryptSecred
  } else if(action === "encryptVault"){
    const encrypt = await encryptVault(args.rawKey, args.password)

    return JSON.stringify(encrypt)
  } else if(action === "decryptVault"){
    const encryptedVault = JSON.parse(args.encrypted)

    const decrypt = await decryptVault(encryptedVault, args.password)
    return decrypt
  } else if(action === "generateSignKey"){
    const signKey = await generateSignKey()

    const [privateKey, publicKey] = await Promise.all([
      cryptoKeyToHex(signKey.privateKey),
      cryptoKeyToHex(signKey.publicKey)
    ])
    return {privateKey, publicKey}
  }
}

function App() {
  const worker = useWorker()

  const [groupId, setGroupId] = useState<string | undefined>(undefined)

  const [signKey, setSignKey] = useState<{ privateKey: string; publicKey: string } | undefined>(undefined)

  const [clientKeys, setClientKeys] = useState<Record<SessionDevice, string> | undefined>(undefined)

  const handleInit = (data: string) => {
    const { groupId, signKey, clientKeys } = JSON.parse(data)

    setGroupId(groupId)
    setSignKey(signKey)
    setClientKeys(clientKeys)

    return
  }

  const handleKeyGen = useCallback(async (data: string) => {
    const { parties, threshold } = JSON.parse(data)

    console.log(parties, threshold)
    return
  }, [])

  const handleMessage = useCallback(
    async ({ data }: MessageEvent) => {
      try{
        const { type, data: dataPayload, id } = JSON.parse(data)

        switch (type) {
          case 'init':
            handleInit(dataPayload)
            break

          case 'keygen':
            await handleKeyGen(dataPayload)
            break

          case "executeCrypto":
            const result = await executeCrypto(dataPayload);
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({ data:result, type:"executeCryptoResponse", id }))
            break

        }
      } catch(e){
        console.log("failure in handleMessage", data, e);
      }
    },

    [handleKeyGen, handleInit]
  )

  useEffect(() => {
    (document as any).addEventListener('message', handleMessage, false)

    return () => {
      (document as any).removeEventListener('message', () => {})
    }
  }, [handleMessage])

  const handleNewKey = (key: IKeyShare) => {
    console.log(key)
  }

  if (!worker) return <div />

  return (
    <MpcProvider
      clientKeys={clientKeys}
      device={SessionDevice.EXTENSION}
      groupId={groupId}
      signKey={signKey}
      worker={worker}
      onNewKey={handleNewKey}
    >
      <Main />
    </MpcProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <WorkerProvider>
      <App />
    </WorkerProvider>
  </StrictMode>
)

