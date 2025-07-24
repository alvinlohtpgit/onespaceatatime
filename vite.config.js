import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'events': 'events',
      'util': 'util',
      'stream': 'stream-browserify',
      'buffer': 'buffer'
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.nextTick': 'queueMicrotask'
  },
  optimizeDeps: {
    include: ['pouchdb', 'pouchdb-find', 'events', 'util', 'buffer'],
    exclude: []
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
