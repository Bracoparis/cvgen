import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['puppeteer', '@puppeteer/browsers'],
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    // Optimiser les options du serveur pour les performances
    hmr: {
      overlay: false, // Désactiver l'overlay HMR qui peut ralentir le navigateur
    },
    // Améliorer le caching
    headers: {
      'Cache-Control': 'max-age=31536000, immutable',
    },
  },
  // Optimisations de build
  build: {
    target: 'esnext', // Pour optimiser la taille du bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Fractionnement des chunks pour optimiser le chargement
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-hook-form', 'zod', 'react-i18next', 'i18next'],
          ui: ['@/components/ui'],
        },
      },
      external: [
        'node:url',
        'node:fs',
        'node:path',
        'node:os',
        'node:http',
        'node:https',
        'node:stream',
        'node:zlib',
        'node:buffer',
        'node:util',
        'node:querystring',
        'node:events',
        'node:child_process',
        'puppeteer',
        '@puppeteer/browsers',
      ],
    },
  },
});
