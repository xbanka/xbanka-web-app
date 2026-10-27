import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

// Periodic evals: hit a real backend, so they are slower and can be flaky.
// Run before shipping (`npm run eval`), never from the pre-commit hook.
// Reads XBANKA_EVAL_* variables from the shell or from .env / .env.local.
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["**/evals/**/*.eval.ts"],
    exclude: ["node_modules/**", ".next/**"],
    env: loadEnv(mode, process.cwd(), "XBANKA_EVAL_"),
    testTimeout: 30_000,
  },
}));
