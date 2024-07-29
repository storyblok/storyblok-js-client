import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ['./tests/**/*.e2e.ts'],
    exclude: ['./old-tests'],
    setupFiles: ['./tests/setup.js'],
  },
})