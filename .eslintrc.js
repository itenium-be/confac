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
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  rules: {
    "implicit-arrow-linebreak": ["error", "below"],
    "no-unused-vars": [1],
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "no-underscore-dangle": [0],
    "object-curly-spacing": [2, "never"],
    "import/extensions": [0],
    "react/destructuring-assignment": [1],
    "import/prefer-default-export": [0],
    "no-shadow": [1],
    "no-multiple-empty-lines": ["error", { max: 3 }],
    "linebreak-style": [0],
    "max-len": [1],
    "dot-notation": [1]
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".ts", ".tsx"]
      }
    }
  },
};
