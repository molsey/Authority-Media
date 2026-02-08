import { defineConfig } from 'vite'
import { resolve } from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { lossless: false, quality: 80 },
      avif: { lossless: false, quality: 65 },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        authority: resolve(__dirname, 'authority.html'),
        media: resolve(__dirname, 'media.html'),
        podcast: resolve(__dirname, 'podcast.html'),
        'podcast-single': resolve(__dirname, 'podcast-single.html'),
        guest: resolve(__dirname, 'guest.html'),
        guests: resolve(__dirname, 'guests.html'),
        form: resolve(__dirname, 'form.html'),
        blueprint: resolve(__dirname, 'blueprint.html'),
        booking: resolve(__dirname, 'booking.html'),
      },
    },
  },
})
