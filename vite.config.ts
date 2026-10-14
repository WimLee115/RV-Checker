/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => {
  const standalone = mode === 'standalone';

  return {
    // Relatieve asset-paden voor de standalone build: die moet ook werken als je het
    // bestand rechtstreeks vanaf schijf opent (file://), waar een absoluut pad als
    // "/assets/..." niet naar de juiste map zou verwijzen.
    base: standalone ? './' : '/',
    plugins: standalone ? [viteSingleFile()] : [],
    build: {
      target: 'es2022',
      outDir: standalone ? 'dist-standalone' : 'dist',
    },
    test: {
      environment: 'node',
      include: ['tests/**/*.test.ts'],
    },
  };
});
