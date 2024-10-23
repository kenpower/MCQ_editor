import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "./", // Ensures relative paths for assets

  server: {
    open: true, // This will open the app in the browser
  },
});
