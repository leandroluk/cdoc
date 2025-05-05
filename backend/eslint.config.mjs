// @ts-check
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginN from 'eslint-plugin-n';
import eslinPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import workspaceEslintRules from '../workspace.eslint.config.mjs';

export default tseslint.config(
  /** @type {import("eslint").Linter.Config} */
  {
    ignores: ['dist', 'eslint.config.mjs', '.prettierrc.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tseslint.parser,
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    plugins: {
      n: eslintPluginN,
      prettier: eslinPluginPrettier,
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      ...workspaceEslintRules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  }
);
