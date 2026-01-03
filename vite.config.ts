import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // In dev we want a root-served app. In production the base path may vary:
  // - GitHub Pages: "/menu-client/" (default)
  // - Docker / generic hosting at domain root: "/" (set VITE_BASE_PATH="/")
  const base =
    mode === 'production'
      ? env.VITE_BASE_PATH || process.env.VITE_BASE_PATH || '/menu-client/'
      : '/';

  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: 'public/locales',
            dest: ''
          }
        ]
      })
    ],
    base,
  };
})
