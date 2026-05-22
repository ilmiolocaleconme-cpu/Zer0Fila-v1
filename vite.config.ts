import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configurazione ufficiale di Vite con supporto agli Alias di percorso (@/)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true // Permette di testare l'app sullo smartphone in rete locale
  }
});
