import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
    // Our only lazy chunk (WebGL2 fallback) has no dependencies to preload; skip the helper + polyfill.
    modulePreload: false,
  },
  server: { host: true }, // expose on LAN for phone testing
});
