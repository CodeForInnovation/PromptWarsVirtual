import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [typeof preact === 'function' ? preact() : (preact as any).default()],
  test: {
    environment: 'jsdom',
    globals: true,
    server: {
      deps: {
        inline: [/zimmerframe/]
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
