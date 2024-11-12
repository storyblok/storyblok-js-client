import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  test: {
    include: ['./tests/**/*.e2e.ts'],
    setupFiles: ['./tests/setup.js'],
  },
  resolve: {
    alias: {
      'storyblok-js-client': path.resolve(__dirname, 'dist'),
    },
  },
})
