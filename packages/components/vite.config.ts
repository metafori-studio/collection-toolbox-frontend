import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

// Storybook conflicts with vue-devtools
// Workaround: https://github.com/storybookjs/storybook/issues/32462#issuecomment-3401454726
// The Storybook Vitest project renders stories in a browser without the devtools
// host, so exclude the plugin under test runs too.
const isStorybookProcess = process.env.npm_lifecycle_event === 'storybook'
  || process.env.VITEST === 'true';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('media-'),
        },
      },
    }),
    !isStorybookProcess && vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
