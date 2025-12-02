const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const eslintRecommended = require('@eslint/js').configs.recommended;

module.exports = [
  {
    ignores: ['node_modules/', 'package.json', 'package-lock.json'],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
    },
    languageOptions: {
      parser: typescriptParser,
      globals: {
        node: true,
        es6: true,
      },
    },
    rules: {
      ...eslintRecommended.rules,
      ...typescriptEslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-console': 'warn' },
  },
];
