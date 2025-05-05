// @ts-check
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginN from 'eslint-plugin-n';
import eslinPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import workspaceEslintRules from '../workspace.eslint.config.mjs';

export default tseslint.config(
  /** @type {import("eslint").Linter.Config} */
  {
    ignores: ['dist/**', 'eslint.config.mjs', '.prettierrc.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false
      },
    },
    plugins: {
      n: eslintPluginN,
      prettier: eslinPluginPrettier,
      '@typescript-eslint': typescriptEslintPlugin
    },
    rules: {
      ...workspaceEslintRules,
      ...eslintPluginPrettierRecommended.rules,
      ...tseslint.configs.recommendedTypeChecked.reduce((obj, item) => ({
        ...obj,
        rules: {...obj.rules, ...item.rules}
      }), {}).rules,
    }
  }
)
