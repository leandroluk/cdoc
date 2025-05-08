// @ts-check
import js from '@eslint/js';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginN from 'eslint-plugin-n';
import eslinPluginPrettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import rulesEslintConfig from '../rules.eslint.config.mjs';

export default tseslint.config(
  /** ignores @type {import("eslint").Linter.Config} */
  {
    ignores: ['dist', 'eslint.config.mjs', 'tailwind.config.js'],
  },
  /** files @type {import("eslint").Linter.Config} */
  {
    files: ['**/*.{ts,tsx}'],
  },
  /** languageOptions @type {import("eslint").Linter.Config} */
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  /** plugins @type {import("eslint").Linter.Config} */
  {
    plugins: {
      n: eslintPluginN,
      prettier: eslinPluginPrettier,
      '@typescript-eslint': typescriptEslintPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
  },
  /** rules @type {import("eslint").Linter.Config} */
  {
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommendedTypeChecked.reduce(
        (obj, item) => ({
          ...obj,
          rules: {...obj.rules, ...item.rules},
        }),
        {}
      ).rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
      ...rulesEslintConfig,
    },
  },
  /** overrides @type {import("eslint").Linter.Config} */
  {
    files: ['**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-misused-promises': 'off'
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off'
    }
  }
);
