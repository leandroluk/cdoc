import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'node:path';
import {defineConfig} from 'vite';

dotenvExpand.expand(dotenv.config());

// https://vite.dev/config/
export default defineConfig({
  plugins: Array().concat(react(), tailwindcss()),
  resolve: {
    alias: {
      '#': path.resolve(__dirname, './src'),
      'package.json': path.resolve(__dirname, 'package.json'),
    },
  },
  server: {
    https: {
      cert: process.env.VITE_HTTPS_CERT?.replace(/\\n/g, '\n'),
      key: process.env.VITE_HTTPS_KEY?.replace(/\\n/g, '\n'),
    },
  },
  optimizeDeps: {include: ['@cdoc/domain']},
  build: {
    commonjsOptions: {include: [/node_modules/, /@cdoc\/domain/]},
    rollupOptions: {
      // is required because in Windows generated source maps has wrong reference of files
      // (generate "c:" and not "C:")
      onwarn: (warning, warn) => warning.message.includes('not read source map') && warn(warning),
    },
  },
});
