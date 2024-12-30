import { lightGreen } from 'kolorist';
import pkg from './package.json';
import banner from 'vite-plugin-banner';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

// eslint-disable-next-line no-console
console.log(`${lightGreen('Storyblok JS Client')} v${pkg.version}`);

export default defineConfig(() => ({
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist/types',
    }),
    banner({
      content: `/**\n * name: ${pkg.name}\n * (c) ${new Date().getFullYear()}\n * description: ${pkg.description}\n * author: ${pkg.author}\n */`,
    }),
  ],
  test: {
    include: ['./src/**/*.test.ts'],
    coverage: {
      include: ['src'],
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/unit/coverage',
    },
  },
}));
