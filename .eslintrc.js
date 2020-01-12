module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["plugin:react/recommended", "airbnb"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  ignorePatterns: ["node_modules", "public", ".vscode"],
  plugins: ["react", "react-hooks", "@typescript-eslint"/*, "typescript"*/],
  rules: {
    "implicit-arrow-linebreak": ["error", "beside"],
    "no-unused-vars": [0, { args: 'none' }], // https://github.com/typescript-eslint/typescript-eslint/issues/46
    // "no-use-before-define": "warn",
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "no-underscore-dangle": [0],
    "object-curly-spacing": [2, "never"],
    "import/extensions": [0],
    "react/destructuring-assignment": [0],
    "import/prefer-default-export": [0],
    "no-shadow": [1],
    "no-multiple-empty-lines": ["error", { max: 7 }],
    "linebreak-style": [0],
    "max-len": ["error", { "code": 140 }],
    "dot-notation": [1],
    "padded-blocks": [0],
    "object-curly-newline": ["error", { "ImportDeclaration": "never" }],
    "no-plusplus": [0],
    "react/no-children-prop": [0],
    "class-methods-use-this": [0],
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".ts", ".tsx"]
      }
    }
  },
};
