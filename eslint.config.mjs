import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  {
    ignores: [
      '*.js',
      'chromium/dist/**/*.js',
      'dist/**/*.js',
      'docs/**/*.js',
      'src/*.template.js',
      'target/**/*.js',
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
];
