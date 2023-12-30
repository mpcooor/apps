import { ILocalKey } from '@llama-wallet/types'
import * as Comlink from 'comlink'
import { createContext, useContext } from 'react'
import { KeyGenerator, Signer } from '../wasm'
import base64Worker from './built'

export interface IEcdsaWorker {
  KeyGenerator(
    parameters: {
      parties: number
      threshold: number
    },
    partySignup: {
      number: number
      uuid: string
    }
  ): Promise<KeyGenerator>

  Signer(index: number, participants: number[], localKey: ILocalKey): Promise<Signer>
}

if (window.location.hash === 'impossible') {
  new Worker(new URL('./worker.ts', import.meta.url), {
    type: 'module'
  })
}

const workerContext = createContext<IEcdsaWorker | null>(null)

export function useWorker() {
  return useContext(workerContext)
}

const blob = new Blob([atob(base64Worker)], {
  type: 'application/javascript'
})

const workerCode = URL.createObjectURL(blob)

const worker: Comlink.Remote<IEcdsaWorker> = Comlink.wrap(new Worker(workerCode))

export function WorkerProvider({ children }: { children: JSX.Element }) {
  return <workerContext.Provider value={worker}>{children}</workerContext.Provider>
}
