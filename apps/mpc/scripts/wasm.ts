import { readFileSync, writeFileSync } from 'fs'

const wasm = readFileSync('./src/mpc/wasm/mpc_ecdsa_wasm_bg.wasm')

// @ts-ignore
const encoded = Buffer.from(wasm, 'binary').toString('base64')

const file = 'export default `' + encoded + '`'

writeFileSync('./src/mpc/wasm/built.ts', file)
