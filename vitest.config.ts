import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ['./tests/**/*.test.ts'],
    exclude: ['./old-tests'],
    setupFiles: ['./tests/setup.js'],
  },
})