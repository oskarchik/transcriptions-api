import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,jsx,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
      },
    },
  },

  {
    rules: {
      'eslint:recommended': 'warn',
    },
  },

  {
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      '@typescript-eslint/recommended': 'warn',
    },
  },

  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'plugin:prettier/recommended': 'warn',
    },
  },
];
