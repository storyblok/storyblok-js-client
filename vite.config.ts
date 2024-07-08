import { defineConfig } from 'vite'

export default defineConfig(() => ({
  test: {
    setupFiles: ['./tests/setup.js'],
  },
}))
