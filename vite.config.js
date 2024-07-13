import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls,
      },
    }),
    envCompatible(),
    quasar({
      sassVariables: 'src/quasar-variables.sass',
    }),
  ],
});
