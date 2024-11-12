import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsConfigPaths()],
  resolve: {
    alias: {
      "@": "/",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    watch: false,
  },
});
