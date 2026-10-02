import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

process.env.DATABASE_URL = "file:./test.db";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    testTimeout: 15_000,
  },
});
