module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "import/prefer-default-export": ['off'],
    "linebreak-style": ['off'],
    "max-len": ['error', 140],
    "class-methods-use-this": ['off'],
    "import/extensions": ['off'],
    "no-unused-vars": ["off"],
    "arrow-parens": 'off',
    "no-plusplus": 'off',
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
};
