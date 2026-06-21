import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": new URL("./", import.meta.url).pathname,
    },
    tsconfigPaths: true,
  },
  test: {
    cache: false,
    environment: "jsdom",
    environmentOptions: {
      NODE_ENV: "development",
    },
    exclude: [".next/**", "dist/**", "node_modules/**"],
    globals: true,
    include: ["__tests__/**/*.test.ts"],
    isolate: false,
    setupFiles: ["./setupTests.ts"],
  },
});
