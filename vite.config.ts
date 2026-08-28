import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode || 'production', process.cwd(), '');
  const masSoraApiKey = env.MAS_SORA_API || process.env.MAS_SORA_API || '';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.MAS_SORA_API': JSON.stringify(masSoraApiKey),
      'process.env.MAS_SORA_API': JSON.stringify(masSoraApiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
