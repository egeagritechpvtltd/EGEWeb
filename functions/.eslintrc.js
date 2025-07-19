module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  globals: {
    require: 'readonly',
    module: 'readonly',
    process: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly'
  },
  rules: {
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    'max-len': ['error', { 'code': 120 }],
    'no-unused-vars': ['error', { 'args': 'none' }],
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
};
