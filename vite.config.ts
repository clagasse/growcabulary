import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    const isGitHubPages = mode === 'gh-pages';
    const base = isGitHubPages ? '/growcabulary/' : '/';

    return {
      base: base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          // Since you have no src folder, '@' points to root
          '@': path.resolve(__dirname, './'),
        }
      },
      build: {
        // This ensures Vite finds your index.html in the root
        outDir: 'dist',
      }
    };
});