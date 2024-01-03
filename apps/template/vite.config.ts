import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from 'vite-plugin-singlefile'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  clearScreen: true,
  plugins: [react(), tsconfigPaths(), viteSingleFile()]
})
