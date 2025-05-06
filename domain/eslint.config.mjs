// @ts-check
import js from '@eslint/js';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginN from 'eslint-plugin-n';
import eslinPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import rulesEslintConfig from '../rules.eslint.config.mjs';


export default tseslint.config(
  /** @type {import("eslint").Linter.Config} */
  {
    files: ["**/*.ts", "**/*.js", "**/*.cts", "**.*.mts"],
  },
  /** @type {import("eslint").Linter.Config} */
  {
    ignores: ['dist', 'eslint.config.mjs'],
  },
  /** @type {import("eslint").Linter.Config} */
  {
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
  },
  /** @type {import("eslint").Linter.Config} */
  {
    plugins: {
      n: eslintPluginN,
      prettier: eslinPluginPrettier,
      '@typescript-eslint': typescriptEslintPlugin
    }
  },
  /** @type {import("eslint").Linter.Config} */
  {
    rules: {
      ...js.configs.recommended.rules,
      ...eslintPluginPrettierRecommended.rules,
      ...tseslint.configs.recommendedTypeChecked.reduce((obj, item) => ({
        ...obj,
        rules: {...obj.rules, ...item.rules}
      }), {}).rules,
      ...rulesEslintConfig,
    }
  }
)
