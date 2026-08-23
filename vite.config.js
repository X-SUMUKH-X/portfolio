import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        creativeStrategy: resolve(__dirname, 'creative-strategy.html'),
        slackSwiggyHq: resolve(__dirname, 'slack-swiggy-hq.html'),
      },
    },
  },
});
