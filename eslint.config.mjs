/* eslint-disable import/no-extraneous-dependencies */
import eslint from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import { fileURLToPath } from "node:url"
import path from "node:path"
import tseslint from "typescript-eslint"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default tseslint.config(
  { ignores: ["dist", "node_modules", "eslint.config.mjs", "__tests__/resources"] },
  {
    extends: [
      eslint.configs.recommended,
      ...compat.extends("airbnb"),
      ...compat.extends("@kesills/airbnb-typescript"),
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "no-underscore-dangle": "off",
      "func-names": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "import/prefer-default-export": "off",
      "import/no-unresolved": "off",
      "import/extensions": "off",
      "no-void": "off",
      "no-plusplus": "off",
      "no-console": "off",
      "@typescript-eslint/class-methods-use-this": "off",
      "@stylistic/lines-between-class-members": "off",
      "no-cond-assign": "off",
      "consistent-return": "off",
      "import/no-extraneous-dependencies": "off",
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
  eslintPluginPrettierRecommended
)
