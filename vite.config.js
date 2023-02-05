import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
export const hash = Math.floor(Math.random() * 90000) + 10000;
export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/js/index.jsx",
            ],
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
          output: {
            entryFileNames: `[name]` + hash + `.js`,
            chunkFileNames: `[name]` + hash + `.js`,
            assetFileNames: `[name]` + hash + `.[ext]`
          }
        }
      }
});
