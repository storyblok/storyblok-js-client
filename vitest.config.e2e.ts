import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['./tests/**/*.e2e.ts'],
    setupFiles: ['./tests/setup.js'],
    alias: {
      'storyblok-js-client': '/dist/index.mjs',
    },
  },
});
