module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    "jest/globals": true,
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
    'jest',
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
    "max-len": [1, { "code": 140 }],
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
    "import/no-extraneous-dependencies": [1],
    "@typescript-eslint/indent": ["error", 2],
    "object-property-newline": ["error", { "allowAllPropertiesOnSameLine": false }],
    "object-curly-newline": ["error", {
      "ObjectExpression": { "multiline": true, "minProperties": 4 },
      "ObjectPattern": { "multiline": true, "minProperties": 4 },
      "ImportDeclaration": { "multiline": true, "minProperties": 5 },
      "ExportDeclaration": { "multiline": true, "minProperties": 3 }
    }],
    "newline-per-chained-call": ["error", { "ignoreChainWithDepth": 3 }],
    "prefer-destructuring": [0],
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".ts"]
      }
    }
  },
};
