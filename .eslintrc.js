module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    // Required to avoid conflicting rules
    // https://github.com/prettier/eslint-plugin-prettier#arrow-body-style-and-prefer-arrow-callback-issue
    "plugin:prettier/recommended",
  ],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  overrides: [
    {
      // 3) Now we enable eslint-plugin-testing-library rules or preset only for matching testing files!
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],

  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "max-lines": ["error", { max: 1000 }],
    "no-console": "error",
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".tsx", ".jsx"],
      },
    ],
    "no-param-reassign": [
      "error",
      { props: true, ignorePropertyModificationsFor: ["state"] },
    ],
    "no-nested-ternary": "off",
    camelcase: "off",
    "react/react-in-jsx-scope": "off", // Official react doc says use JSX without importing React from React 17
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/no-named-as-default": "off",
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/*.test.ts", "**/*.test.tsx"] },
    ],
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/jsx-props-no-spreading": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "react/jsx-curly-brace-presence": "off",
    // We don't use prop types so no need for these rules
    "react/prop-types": "off",
    "react/require-default-props": "off",
    "no-console": "warn",
    "react/jsx-key": ["warn", { checkFragmentShorthand: true }],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"],
        moduleDirectory: ["src", "node_modules"],
      },
      typescript: {
        alwaysTryTypes: true,
        paths: "./tsconfig.json",
      },
    },
  },
  ignorePatterns: [".eslintrc.js"],
};
