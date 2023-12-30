import { IKeyShare, SessionDevice } from '@llama-wallet/types'
import { StrictMode, useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { MpcProvider, WorkerProvider, useWorker } from '@/mpc'

function Main() {
  /*   
  const sendMessage = (type: string, data: string) => {
    window.parent.postMessage({ data, type }, '*')
  } 
  */

  return <div />
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
      const { type, data: dataPayload } = data

      switch (type) {
        case 'init':
          handleInit(dataPayload)
          break

        case 'keygen':
          await handleKeyGen(dataPayload)
          break
      }
    },

    [handleKeyGen, handleInit]
  )

  useEffect(() => {
    window.addEventListener('message', handleMessage, false)

    return () => {
      window.removeEventListener('message', () => {})
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
