import { storyblokLintConfig } from '@storyblok/eslint-config';

export default storyblokLintConfig({
  rules: {
    '@typescript-eslint/no-this-alias': 'off',
    'ts/no-this-alias': 'off',
    'no-async-promise-executor': 'off',
  },
  ignores: ['**/node_modules/**', 'playground', 'README.md'],
});
