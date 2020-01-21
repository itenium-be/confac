module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
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
  ignorePatterns: ["node_modules", "dist", ".vscode", "templates", ".github", ".gitignore"],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "implicit-arrow-linebreak": ["error", "beside"],
    "no-unused-vars": [0, { args: 'none' }], // https://github.com/typescript-eslint/typescript-eslint/issues/46
    "no-use-before-define": [0],
    "no-underscore-dangle": [0],
    "object-curly-spacing": [2, "never"],
    "import/extensions": [0],
    "import/prefer-default-export": [0],
    "no-shadow": [1],
    "no-multiple-empty-lines": ["error", { max: 7 }],
    "linebreak-style": [0],
    "max-len": ["error", { "code": 140 }],
    "dot-notation": [1],
    "padded-blocks": [0],
    "object-curly-newline": ["error", { "ImportDeclaration": "never" }],
    "no-plusplus": [0],
    "arrow-parens": ["error", "as-needed"],
    "quotes": ["error", "single"],
    "@typescript-eslint/member-delimiter-style": ['error', {
      multiline: {
        delimiter: "semi",
        requireLast: true
      },
      singleline: {
        delimiter: "semi",
        requireLast: true
      }
    }],
    "eol-last": [0],
    "import/no-extraneous-dependencies": [1]
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".ts"]
      }
    }
  },
};
