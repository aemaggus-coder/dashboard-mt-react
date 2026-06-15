import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'vendor-charts';
          if (id.includes('/d3') || id.includes('topojson')) return 'vendor-d3';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('react-router-dom')) return 'vendor-react';
        },
      },
    },
  },
});
