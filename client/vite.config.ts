import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import htmlPlugin from 'vite-plugin-html-config';
import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'server', 'data', 'catalog.json'), 'utf8'));

const htmlPluginOpt = {
  title: `CDSE ${data.gitlab.last_activity_at.slice(0, 7)} [${Object.keys(data.projects).length}]`,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
    }),
    Checker({ typescript: true }),
    AutoImport({
      imports: ['vue'],
    }),
    htmlPlugin(htmlPluginOpt),
  ],
  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
