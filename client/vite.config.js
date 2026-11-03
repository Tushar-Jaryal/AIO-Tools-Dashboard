import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

// Keep the old CRA-style absolute imports (e.g. "components/Header")
const src = (dir) => fileURLToPath(new URL(`./src/${dir}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      assets: src("assets"),
      components: src("components"),
      scenes: src("scenes"),
      state: src("state"),
      theme: src("theme.js"),
    },
  },
  server: {
    port: 3000,
    proxy: { "/api": "http://localhost:9000" },
  },
  build: { outDir: "build" },
});
