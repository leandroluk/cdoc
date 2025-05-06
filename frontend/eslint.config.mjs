// @ts-check
import js from '@eslint/js';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginN from 'eslint-plugin-n';
import eslinPluginPrettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  /** @type {import("eslint").Linter.Config} */
  {
    ignores: ['dist', 'eslint.config.mjs']
  },
  /** @type {import("eslint").Linter.Config} */
  {
    files: ['**/*.{ts,tsx}'],
  },
  /** @type {import("eslint").Linter.Config} */
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
  /** @type {import("eslint").Linter.Config} */
  {
    plugins: {
      n: eslintPluginN,
      prettier: eslinPluginPrettier,
      '@typescript-eslint': typescriptEslintPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
  },
  {
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommendedTypeChecked.reduce((obj, item) => ({
        ...obj,
        rules: {...obj.rules, ...item.rules}
      }), {}).rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        {allowConstantExport: true},
      ],
    },
  },
)
