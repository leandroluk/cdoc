// @ts-check

/** @type {import("eslint").Linter.Config['rules']} */
export default {
  //#region @typescript-eslint
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  '@typescript-eslint/no-redundant-type-constituents': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-function-type': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-use-before-define': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-array-constructor': 'off',
  '@typescript-eslint/no-misused-promises': 'off',
  '@typescript-eslint/no-warning-comments': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/require-await': 'off',
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/camelcase': 'off',
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports',
    },
  ],
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  //#endregion
  //#region prettier
  'prettier/prettier': [
    'error',
    {
      bracketSpacing: false,
      singleQuote: true,
      trailingComma: 'es5',
      arrowParens: 'avoid',
      printWidth: 120,
    },
  ],
  //#endregion
  //#region n
  'n/no-extraneous-import': 'off',
  'n/no-missing-import': 'off',
  'n/no-empty-function': 'off',
  'n/no-unsupported-features/es-syntax': 'off',
  'n/no-missing-require': 'off',
  'n/shebang': 'off',
  //#endregion
  //#region eslint "no-*"
  'no-unneeded-ternary': 'error',
  'no-dupe-class-members': 'off',
  'no-var': 'error',
  'no-trailing-spaces': 'error',
  'no-restricted-properties': ['error', {object: 'describe', property: 'only'}, {object: 'it', property: 'only'}],
  //#endregion
  //#region eslint *
  'require-atomic-updates': 'off',
  'block-scoped-var': 'error',
  'prefer-const': 'error',
  'eol-last': 'error',
  'prefer-arrow-callback': 'error',
  curly: ['error', 'all'],
  eqeqeq: 'error',
  quotes: ['warn', 'single', {avoidEscape: true}],
  //#endregion
};
