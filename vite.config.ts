import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: { target: 'es2022' },
  server: { host: true }, // expose on LAN for phone testing
});
