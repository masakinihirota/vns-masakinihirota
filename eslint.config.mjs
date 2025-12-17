import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": "off",
      // "no-unused-vars": "off", // JS標準ルールも念のためOFF
      // strict-rule準拠ルール（型情報不要なもののみ）
      // II-3 let禁止、constのみ使用
      "prefer-const": "error",
      "no-var": "error",

      // III-1 throw禁止
      "no-throw-literal": "error",

      // III-2 try/catch禁止（警告レベル）
      "no-restricted-syntax": [
        "warn",
        {
          selector: "TryStatement",
          message: "try/catchは腐敗防止層でのみ使用してください（strict-rule III-2）",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "dist/**",
    "node_modules/**",
    "src/components/ui/**",
  ]),
]);

export default eslintConfig;
