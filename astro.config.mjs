import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://juanmendo.dev',
  output: 'server',
  adapter: vercel(),
  compressHTML: true,
  image: {
    quality: 75,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
