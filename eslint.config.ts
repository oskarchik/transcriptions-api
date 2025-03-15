import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";

const config = [
  {
    languageOptions: {
      globals: {
        es2021: true,
        browser: true,
        node: true,
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
    },
  },

  {
    rules: {
      "eslint:recommended": "warn",
    },
  },

  {
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      "@typescript-eslint/recommended": "warn",
    },
  },

  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "plugin:prettier/recommended": "warn",
    },
  },
];

export default config;
