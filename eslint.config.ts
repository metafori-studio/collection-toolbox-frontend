import path from 'node:path';
import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import pluginOxlint from 'eslint-plugin-oxlint';
import storybook from 'eslint-plugin-storybook';

const workspaces = [
  'apps/archeo',
  'apps/etno',
  'apps/lidice-art',
  'apps/lidice-memorial',
  'packages/components',
  'packages/shared',
];

const sharedRules = {
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
} as const;

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['**/src/**/__tests__/*', '**/src/**/*.{test,spec}.{ts,tsx}'],
  },

  ...storybook.configs['flat/recommended'],

  ...workspaces.map((ws) => ({
    files: [`${ws}/**/*.{vue,ts,mts,tsx}`],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.resolve(import.meta.dirname, ws),
      },
    },
  })),

  ...pluginOxlint.buildFromOxlintConfigFile('apps/lidice-art/.oxlintrc.json'),

  { rules: sharedRules },
);
