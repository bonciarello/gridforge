/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 4599,
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 4599,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    css: true,
  },
});
