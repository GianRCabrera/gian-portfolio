import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    rollupOptions: {
      // Case study pages are separate HTML entries next to the main site.
      input: {
        main: resolve(__dirname, 'index.html'),
        rabdashDcMobile: resolve(__dirname, 'rabdash-dc-mobile/index.html'),
      },
    },
  },
})