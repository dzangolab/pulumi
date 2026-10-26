import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importX from "eslint-plugin-import-x";
import n from "eslint-plugin-n";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import promise from "eslint-plugin-promise";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default [
  js.configs.recommended,
  n.configs["flat/recommended"],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  ...typescriptEslint.configs["flat/recommended"],
  unicorn.configs.recommended,
  // Must come last so it disables rules that conflict with prettier
  prettierRecommended,
  {
    ignores: ["dist/", "eslint.config.js", "ship.config.cjs", "vite.config.ts"],
  },
  {
    files: ["**/*.js", "**/*.ts"],
    plugins: {
      promise,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      node: {
        tryExtensions: [".js", ".json", ".node", ".ts"],
      },
    },
    rules: {
      curly: ["error", "all"],
      "brace-style": ["error", "1tbs"],
      "import-x/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
        },
      ],
      "n/no-unpublished-import": [
        "error",
        {
          allowModules: [],
        },
      ],
      "n/no-unsupported-features/es-syntax": [
        "error",
        {
          ignores: ["modules"],
        },
      ],
      "prettier/prettier": "error",
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            snakeCase: true,
          },
          checkDirectories: false,
        },
      ],
      "unicorn/name-replacements": [
        "error",
        {
          allowList: {
            args: true,
            opts: true,
            env: true,
            err: true,
            i: true,
          },
        },
      ],
      "unicorn/numeric-separators-style": [
        "error",
        {
          number: {
            minimumDigits: 6,
            groupLength: 3,
          },
        },
      ],
    },
  },
];
