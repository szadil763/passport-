import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // O SDK do Firebase (com cache offline do Firestore) passa de 500 kB; ele fica em arquivo próprio.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Separa as bibliotecas em arquivos próprios: o navegador guarda em cache
        // e o código do app fica leve.
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
