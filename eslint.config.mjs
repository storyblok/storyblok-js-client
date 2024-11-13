import { storyblokLintConfig } from '@storyblok/eslint-config';

export default storyblokLintConfig({
  rules: {
    // @TODO: remove all of them after fixing and proper testing in v7
    '@typescript-eslint/no-this-alias': 'off',
    'ts/no-this-alias': 'off',
    'no-async-promise-executor': 'off',
  },
  ignores: ['**/node_modules/**', 'playground', 'README.md'],
});
