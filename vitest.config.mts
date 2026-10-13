import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Gate tests: deterministic, offline, run by the pre-commit hook.
// Paid / networked evals live in vitest.eval.config.mts.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    // Node by default (fast). Component tests opt in to the DOM with a
    // `// @vitest-environment happy-dom` comment at the top of the file.
    environment: "node",
    include: ["**/__tests__/**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
  },
});
