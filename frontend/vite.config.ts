import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [typeof preact === 'function' ? preact() : preact.default()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
