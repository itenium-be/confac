import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2020,
        ...globals.jest,
      },
    },
    rules: {
      // Preserved from original config
      'implicit-arrow-linebreak': ['error', 'beside'],
      'no-use-before-define': 'off',
      'no-underscore-dangle': 'off',
      'object-curly-spacing': ['error', 'never'],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-multiple-empty-lines': ['error', {max: 7}],
      'linebreak-style': 'off',
      'max-len': ['warn', {code: 140}],
      'dot-notation': 'warn',
      'padded-blocks': 'off',
      'no-plusplus': 'off',
      'no-console': 'warn',
      'arrow-parens': ['error', 'as-needed'],
      quotes: ['error', 'single'],
      'eol-last': 'off',
      'object-property-newline': 'off',
      'object-curly-newline': ['error', {
        ObjectExpression: {multiline: true, minProperties: 5},
        ObjectPattern: {multiline: true, minProperties: 5},
        ImportDeclaration: {multiline: true, minProperties: 8},
        ExportDeclaration: {multiline: true, minProperties: 3},
      }],
      'newline-per-chained-call': ['error', {ignoreChainWithDepth: 3}],
      'prefer-destructuring': 'off',

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'public/**', 'templates/**'],
  }
);
