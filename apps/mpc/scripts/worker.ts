import { readFileSync, writeFileSync, readdirSync } from 'fs'

const files = readdirSync('./dist/assets/')

const workerFile = files.find((files) => files.split('-')[0] === 'worker')

if (workerFile) {
  const worker = readFileSync(`./dist/assets/${workerFile}`)

  // @ts-ignore
  const encoded = Buffer.from(worker, 'binary').toString('base64')

  const file = 'export default `' + encoded + '`'

  writeFileSync('./src/mpc/worker/built.ts', file)
}
