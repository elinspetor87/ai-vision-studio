import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";
import puppeteer from "@prerenderer/renderer-puppeteer";
import { generateRoutes } from "./scripts/generate-routes.js";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  base: './', // Use relative paths for assets to work in any deployment scenario
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && prerender({
      routes: await generateRoutes(),
      renderer: new puppeteer({
        renderAfterTime: 2000, // Wait 2 seconds for React to render
        headless: true,
      }),
      postProcess(renderedRoute) {
        // Clean up the HTML
        renderedRoute.html = renderedRoute.html
          .replace(/\n\s*/g, '\n')
          .trim();
        return renderedRoute;
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
