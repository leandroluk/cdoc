// @ts-check
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginN from 'eslint-plugin-n';
import eslinPluginPrettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import workspaceEslintRules from '../workspace.eslint.config.mjs';

export default tseslint.config(
  /** @type {import("eslint").Linter.Config} */
  {
    ignores: ['dist/**', 'eslint.config.mjs', '.prettierrc.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        warnOnUnsupportedTypeScriptVersion: false
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      n: eslintPluginN,
      prettier: eslinPluginPrettier,
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      ...workspaceEslintRules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        {allowConstantExport: true},
      ],
    },
  },
)
