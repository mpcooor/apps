import * as Comlink from 'comlink'

import { KeyGenerator, Signer, init } from '../wasm'

void (async () => {
  await init()

  self.postMessage({ ready: true })
})()

Comlink.expose({
  KeyGenerator,
  Signer
})
