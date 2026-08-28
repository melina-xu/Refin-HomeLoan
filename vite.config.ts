import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'mas-sora-api-middleware',
      configureServer(server) {
        server.middlewares.use('/api/mas-sora', async (req, res) => {
          try {
            const { default: handler } = await import('./api/mas-sora');
            await handler(req, res);
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
        server.middlewares.use('/api/mas-rates', async (req, res) => {
          try {
            const { default: handler } = await import('./api/mas-sora');
            await handler(req, res);
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
    // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
