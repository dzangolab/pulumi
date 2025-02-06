import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import n from "eslint-plugin-n";
import prettier from "eslint-plugin-prettier";
import promise from "eslint-plugin-promise";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:n/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
      "plugin:prettier/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:unicorn/recommended",
      "prettier",
    ),
  ),
  {
    ignores: ["dist/", "eslint.config.js", "ship.config.cfs", "vite.config.ts"],
  },
  {
    files: ["**/*.js", "**/*.ts"],
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
      n: fixupPluginRules(n),
      prettier: fixupPluginRules(prettier),
      promise,
      unicorn: fixupPluginRules(unicorn),
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
      "import/order": [
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
      "unicorn/prevent-abbreviations": [
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
    },
  },
];
