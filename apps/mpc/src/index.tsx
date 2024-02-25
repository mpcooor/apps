import { IKeyShare, SessionDevice } from '@llama-wallet/types'
import { StrictMode, useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { MpcProvider, WorkerProvider, useWorker, useMpc } from '@/mpc'
import { cryptoKeyToHex, decryptVault, deriveKey, deriveSymmetricKeyFromPassword, encryptVault, generateKeyExchangeKey, generateSignKey, hexToBuffer, signCryptoKeyFromHex, syncCryptoKeyFromHex, verifySignature } from '@llama-wallet/utils'

function Main() {
  const mpc = useMpc()
  useEffect(() => {
    if (mpc) {
      console.log('MPC context changed', mpc);
    } else {
      console.error('MPC context is not available');
    }
  }, [mpc]);

  if (!mpc) return <></>;

  const { initialized, createWallet } = mpc;

  const handleKeyGen = useCallback(async (data: { parties: number; threshold: number }) => {
    console.log('handlekeygen', data, initialized)
    // let keyGenResult = {"keys": "random"}
    const keyGenResult = await createWallet(data.parties, data.threshold);
    return keyGenResult
  }, [createWallet, initialized])

  const handleKeygenMessage = useCallback(
    async ({ data }: MessageEvent) => {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        const { type, data: dataPayload, id } = parsedData;

        console.log('got message', type, dataPayload);

        switch (type) {
          case 'keygen':
            const keyGenResult = await handleKeyGen(dataPayload);
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({ data: keyGenResult, type: "keygenResponse", id }));
            break;
        }
      } catch (e) {
        console.log("failure in handleKeygenMessage", data, e);
      }
    },
    [handleKeyGen]
  );

  useEffect(() => {
    // Add the event listener for messages
    window.addEventListener('message', handleKeygenMessage, false);

    return () => {
      // Clean up the event listener
      window.removeEventListener('message', handleKeygenMessage, false);
    };
  }, [handleKeygenMessage]);
  

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

  const handleInit = (data: { groupId: string; signKey: { privateKey: string; publicKey: string }; clientKeys: Record<SessionDevice, string> }) => {
    console.log('handleInit', data);
    const { groupId, signKey, clientKeys } = data

    setGroupId(groupId)
    setSignKey(signKey)
    setClientKeys(clientKeys)
    console.log('handleInit completed', groupId, signKey, clientKeys );
    return
  }

  const handleMessage = useCallback(
    async ({ data }: MessageEvent) => {
      try{
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        const { type, data: dataPayload, id } = parsedData

        switch (type) {
          case 'init':
            handleInit(dataPayload)
            break

          case "executeCrypto":
            const result = await executeCrypto(dataPayload);
            console.log('executeCrypto result', result);
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({ data:result, type:"executeCryptoResponse", id }))
            break

        }
      } catch(e){
        console.log("failure in handleMessage", data, e);
      }
    },
    []
  )

  useEffect(() => {
    const eventListener = (event: MessageEvent) => handleMessage(event);

    (window as any).addEventListener('message', eventListener, false);

    return () => {
      (window as any).removeEventListener('message', eventListener, false);
    };
  }, [handleMessage]);

  const handleNewKey = (key: IKeyShare) => {
    console.log(key)
  }

  if (!worker || !(clientKeys && groupId && signKey)) return <div />

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

