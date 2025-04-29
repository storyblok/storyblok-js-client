import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import { resolve } from 'pathe'

import { qrcode } from 'vite-plugin-qrcode'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    qrcode(), // only applies in dev mode
    tailwindcss(),
  ],
  resolve: {
    alias: {
      'storyblok-js-client': resolve(__dirname, '../../src/index.ts'),
    },
  },
})
