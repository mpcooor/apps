import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  clearScreen: true,
  plugins: [
    react(),
    tsconfigPaths(),
    nodePolyfills({
      include: ['events'],
      globals: {
        global: true
      }
    }),
    viteSingleFile()
  ]
})
