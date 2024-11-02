module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "tsconfig.app.json",
  },
  settings: {
    typescript: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:unicorn/recommended",
    "plugin:sonarjs/recommended",
  ],
  plugins: ["simple-import-sort"],
  ignorePatterns: ["**/config/device/*.ts", "**/device-utils.ts", ""],
  rules: {
    "react/prop-types": ["off"],
    "react/display-name": "off",
    "react/jsx-no-bind": [
      "off",
      {
        ignoreRefs: true,
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector: 'SwitchCase > *.consequent[type!="BlockStatement"]',
        message: "Switch cases without blocks are forbidden.",
      },
      {
        selector: "ExportAllDeclaration,ImportAllDeclaration",
        message: "Export/Import all (*) is forbidden.",
      },
      {
        selector: "ExportNamedDeclaration[declaration!=null]",
        message: "Exports should be at the end of the file.",
      },
      {
        selector:
          "ImportDeclaration[importKind=type],ExportNamedDeclaration[exportKind=type]",
        message:
          "Avoid import/export type { Type } from './module'. Prefer import/export { type Type } from './module'.",
      },
    ],
    "no-console": ["off"],
    "max-params": ["error", 3],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
      },
    ],
    curly: ["error", "all"],
    "unicorn/prefer-spread": ["off"],
    "unicorn/prefer-at": "off",
    "sonarjs/cognitive-complexity": "off",
    "unicorn/no-null": ["off"],
    "unicorn/no-nested-ternary": "off",
    "unicorn/prefer-add-event-listener": "off",
    "unicorn/prefer-node-protocol": "off",
    "unicorn/prevent-abbreviations": [
      "error",
      {
        allowList: {
          Props: true,
          props: true,
          ref: true,
          Ref: true,
          forwardedRef: true,
          params: true,
          Params: true,
        },
      },
    ],
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/lines-between-class-members": ["error"],
    "@typescript-eslint/padding-line-between-statements": [
      "error",
      {
        blankLine: "never",
        prev: "export",
        next: "export",
      },
      {
        blankLine: "always",
        prev: ["const", "class"],
        next: "export",
      },
      {
        blankLine: "always",
        prev: "*",
        next: [
          "switch",
          "class",
          "function",
          "if",
          "return",
          "try",
          "interface",
          "type",
        ],
      },
    ],
    "simple-import-sort/imports": ["error"],
    "simple-import-sort/exports": ["error"],
    "import/no-unresolved": ["off"],
    "import/extensions": [
      "error",
      "always",
      {
        ignorePackages: true,
      },
    ],
    "import/newline-after-import": [
      "error",
      {
        count: 1,
      },
    ],
    "import/no-default-export": ["error"],
    "import/first": ["error"],
    "import/no-duplicates": ["error"],
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/consistent-type-definitions": ["off"],
    "@typescript-eslint/non-nullable-type-assertion-style": ["off"],
    "@typescript-eslint/return-await": ["error"],
    "@typescript-eslint/quotes": ["error", "single"],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/consistent-type-exports": ["error"],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowTypedFunctionExpressions: true,
      },
    ],
    "@typescript-eslint/no-empty-interface": [
      "error",
      {
        allowSingleExtends: true,
      },
    ],
    "@typescript-eslint/explicit-member-accessibility": ["error"],
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-invalid-void-type": ["off"],
  },
  overrides: [
    {
      files: ["vite.config.ts"],
      rules: {
        "import/no-default-export": ["off"],
      },
    },
    {
      files: ["*.d.ts"],
      rules: {
        "unicorn/prevent-abbreviations": ["off"],
        "@typescript-eslint/consistent-type-definitions": ["off"],
      },
    },
    {
      files: ["chat-socket.middleware.ts"],
      rules: {
        "unicorn/prefer-regexp-test": ["off"],
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "simple-import-sort/imports": [
          "error",
          {
            groups: [
              ["^react", "^@?\\w"],
              ["^(@|components)(/.*|$)"],
              ["^\\u0000"],
              ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
              ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
              ["^.+\\.?(css)$"],
            ],
          },
        ],
      },
    },
    {
      files: ["./src/app/i18n/config.ts"],
      rules: {
        "@typescript-eslint/no-floating-promises": ["off"],
      },
    },
  ],
};
