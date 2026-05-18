import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        /** IPv4 — unika problemów, gdy „localhost” idzie w ::1, a serwer tylko na IPv4 */
        host: '127.0.0.1',
        strictPort: false,
        open: false,
        proxy: {
          '/api': {
            target: 'http://localhost:3002',
            changeOrigin: true,
          }
        }
      },
      preview: {
        port: 4173,
        host: '127.0.0.1',
        strictPort: false,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.RESEND_API_KEY': JSON.stringify(env.RESEND_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
