import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "./", // Ensures relative paths for assets
  build: {
    outDir: "docs", // so github can serve it as a page
  },
  server: {
    open: true, // This will open the app in the browser
  },
});
