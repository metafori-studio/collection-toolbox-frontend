import { globalIgnores } from 'eslint/config';
import pluginOxlint from 'eslint-plugin-oxlint';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    name: 'app/files-to-lint',
    files: ['**/*.ts'],
  },

  globalIgnores(['**/dist/**', '**/coverage/**']),

  ...tseslint.configs.recommended,
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-parens': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
);
