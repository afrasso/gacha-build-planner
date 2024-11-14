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
    deps: {
      optimizer: {
        web: {
          include: ["react", "react-dom", "@testing-library/react"],
        },
      },
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["./setupTests.ts"],
    watch: false,
  },
});
