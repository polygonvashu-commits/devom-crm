import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Makes all build assets relative, allowing easy deployment to GitHub Pages or subfolders
  server: {
    port: 3000,
    open: true
  }
});
