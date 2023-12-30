import * as Comlink from 'comlink'

import { init, KeyGenerator, Signer } from '../wasm'

void (async () => {
  await init()

  self.postMessage({ ready: true })
})()

Comlink.expose({
  KeyGenerator,
  Signer
})
