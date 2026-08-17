import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  base: '/canvas-dark-mode/',
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tanstackStart({
      prerender: { enabled: true },
    }),
    viteReact(),
  ],
})

export default config
