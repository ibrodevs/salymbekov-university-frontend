import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/proxy-backend': {
        target: 'https://med-backend-d61c905599c2.herokuapp.com',
        changeOrigin: true,
        secure: false,
        // Сервисы используют два стиля путей: одни уже содержат "/api/",
        // другие — нет (а research смонтирован в бэкенде как "/research").
        // Нормализуем оба к корректному пути на бэкенде.
        rewrite: (path) => {
          const p = path.replace(/^\/proxy-backend/, '');
          if (p.startsWith('/api/') || p.startsWith('/api?')) return p;
          if (p.startsWith('/research')) return p;
          return '/api' + p;
        }
      },
      '/media': {
        target: 'https://med-backend-d61c905599c2.herokuapp.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/media/, '/media')
      }
    }
  }
});
