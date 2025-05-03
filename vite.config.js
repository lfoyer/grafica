import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // This ensures the build goes to the 'dist' folder
  },
  base: '/grafica/', // Important for GitHub Pages
});
