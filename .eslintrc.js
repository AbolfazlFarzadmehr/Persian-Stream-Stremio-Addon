module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.mjs'],
      },
    },
  },
  rules: {
    'no-console': 'warn',
    'comma-dangle': ['error', 'only-multiline'],
    'new-cap': ['error', { newIsCap: false }],
    'no-unused-vars': ['warn', { args: 'none' }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'always',
        mjs: 'always',
      },
    ],
  },
};
