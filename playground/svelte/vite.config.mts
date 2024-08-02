import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { qrcode } from 'vite-plugin-qrcode'
import { resolve } from 'pathe'

export default defineConfig({
  plugins: [
    svelte(),
    qrcode(), // only applies in dev mode
  ],
  resolve: {
    alias: {
      'storyblok-js-client': resolve(__dirname, '../../src/index.ts'),
    },
  },
})
