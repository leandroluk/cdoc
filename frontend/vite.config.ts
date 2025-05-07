import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import {defineConfig} from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: Array().concat(react(), tailwindcss()),
  resolve: {
    alias: {
      '#': path.resolve(__dirname, './src'),
      'package.json': path.resolve(__dirname, 'package.json'),
    },
  },
  optimizeDeps: {include: ['@cdoc/domain']},
  build: {commonjsOptions: {include: [/node_modules/, /@cdoc\/domain/]}},
});
