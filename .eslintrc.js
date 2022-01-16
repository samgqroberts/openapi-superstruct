module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['simple-import-sort'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      node: {
        extensions: ['.ts']
      }
    }
  },
  env: {
    browser: true,
    amd: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended' // Make sure this is always the last element in the array.
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'simple-import-sort/imports': 'error'
  }
};
