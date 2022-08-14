import { defineConfig } from 'astro/config';

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: 'https://joerick.me',
  integrations: [vue()],
  vite: {
    ssr: {
        noExternal: ['astro-seo']
    },
  },
});
