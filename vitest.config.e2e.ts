import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['./tests/**/*.e2e.ts'],
    setupFiles: ['./tests/setup.js'],
    alias: {
      'storyblok-js-client': '/dist/index.mjs',
    },
  },
});
