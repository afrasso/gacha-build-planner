import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react(), tsConfigPaths()],
  resolve: {
    alias: {
      "@": new URL("./", import.meta.url).pathname,
    },
  },
  test: {
    cache: false,
    deps: {
      optimizer: {
        web: {
          include: ["react", "react-dom", "@testing-library/react"],
        },
      },
    },
    environment: "jsdom",
    environmentOptions: {
      NODE_ENV: "development", // Forces React to use the development build
    },
    globals: true,
    isolate: false, // Run tests in a single process
    setupFiles: ["./setupTests.ts"],
    watch: !process.env.CI,
  },
});
