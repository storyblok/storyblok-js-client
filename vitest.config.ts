import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['./src/**/*.test.ts'],
    setupFiles: ['./tests/setup.js'],
    coverage: {
      include: ['src'],
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/unit/coverage'
    },
  },
})
