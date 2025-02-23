import baseConfig, { restrictEnvAccess } from "@workspace/eslint/base";
import nextjsConfig from "@workspace/eslint/nextjs";
import reactConfig from "@workspace/eslint/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];