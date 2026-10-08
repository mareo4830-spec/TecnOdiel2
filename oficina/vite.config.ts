import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // En el monorepo de TecnOdiel la oficina cuelga de /oficina/ (build-all.mjs pasa VITE_BASE);
  // en solitario, de la raíz.
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  // Tailwind v4 va por su plugin de Vite: no heredar el postcss.config.js (Tailwind v3) de la
  // raíz del monorepo de TecnOdiel cuando la oficina cuelga de /oficina/.
  css: { postcss: { plugins: [] } },
  build: {
    rollupOptions: {
      output: {
        // Librerías en chunks propios: cambian poco y el navegador las mantiene en caché entre despliegues.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('react-router')) return 'router';
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react';
          return undefined;
        },
      },
    },
  },
});
