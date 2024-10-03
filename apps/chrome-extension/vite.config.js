import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { imagetools } from "vite-imagetools";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "./index.html"),
        "service-worker": path.resolve(__dirname, "./src/service-worker.js"),
        "content-script-world": path.resolve(
          __dirname,
          "./src/content-script-world.js"
        ),
        "content-script-isolated": path.resolve(
          __dirname,
          "./src/content-script-isolated.js"
        ),

        /** Tomarket Content Scripts */
        "tomarket-isolated": path.resolve(
          __dirname,
          "./src/drops/tomarket/tomarket-isolated.js"
        ),
        "tomarket-world": path.resolve(
          __dirname,
          "./src/drops/tomarket/tomarket-world.js"
        ),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [react(), imagetools()],
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
});
