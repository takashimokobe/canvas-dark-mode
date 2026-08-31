import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import contentCollections from '@content-collections/vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

const isProduction = process.env.NODE_ENV === 'production'

const config = defineConfig({
  base: '/canvas-dark-mode/',
  resolve: { tsconfigPaths: true },
  // `localhost` avoids macOS EADDRNOTAVAIL on loopback worker ports during SSR.
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: 'localhost',
    port: 3000,
  },
  plugins: [
    contentCollections(),
    devtools(),
    nitro(),
    tanstackStart({
      // Prerender only for production builds — dev prerender hammers loopback.
      prerender: { enabled: isProduction },
    }),
    viteReact(),
  ],
})

export default config
