import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://copisteria-central.vercel.app',
  output: 'server',
  adapter: vercel(),
  compressHTML: true,
  image: {
    quality: 70,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
