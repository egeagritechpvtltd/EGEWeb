import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcssImport from 'postcss-import';
import tailwindcssNesting from 'tailwindcss/nesting';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        tailwindcssNesting(),
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    host: '0.0.0.0',
    hmr: {
      port: 3001, // Use a different port for HMR
      protocol: 'ws',
      host: 'localhost',
    },
    fs: {
      strict: false,
    },
    // This handles all routes by serving index.html
    proxy: {},
  },
    // Production build configuration
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    // Ensure static assets are properly referenced
    assetsDir: 'assets',
    // Enable sourcemaps for better debugging
    sourcemap: true,
  },
  // Base public path when served in production
  base: '/',
  // SPA fallback for client-side routing
  appType: 'spa',
  // Ensure proper handling of history API fallback in production
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
  },
});
