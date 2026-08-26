import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/tests/**/*.test.ts"],
    // Node, not a browser: everything under test here is plain data and plain
    // functions. Nothing reaches for the DOM, so nothing has to fake one.
    environment: "node",
  },
});
