module.exports = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  extends: ['@react-native-community', 'plugin:prettier/recommended'],
  root: true,
  rules: {
    'react-native/no-inline-styles': 'off',
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
    react: {
      version: 'detect',
    },
  },
};
