/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { lightGreen } from 'kolorist';

import pkg from './package.json';
import banner from 'vite-plugin-banner';
import dts from 'vite-plugin-dts';

// eslint-disable-next-line no-console
console.log(`${lightGreen('Storyblok Richtext')} v${pkg.version}`);

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    banner({
      content: `/**\n * name: ${pkg.name}\n * (c) ${new Date().getFullYear()}\n * description: ${pkg.description}\n * author: ${pkg.author}\n */`,
    }),
  ],
});
