import { readFileSync, writeFileSync } from 'fs'

const wasm = readFileSync('./apps/mpc/src/mpc/wasm/mpc_ecdsa_wasm_bg.wasm')

// @ts-ignore
const encoded = Buffer.from(wasm, 'binary').toString('base64')

const file = `export default \`${encoded}\``

writeFileSync('./apps/mpc/src/mpc/wasm/built.ts', file)
