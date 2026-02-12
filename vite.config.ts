import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const isMock = mode === 'mock'

  // 使用 fileURLToPath 确保路径格式正确
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const sharedStylesPath = path.resolve(__dirname, '../packages/shared-types/styles/variables.scss')

  return {
    plugins: [vue()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${sharedStylesPath.replace(/\\/g, '/')}" as *;`
        }
      }
    },
    server: {
      port: 3000,
      host: true,
      proxy: isMock ? {
        '/api/chat/stream': {
          target: 'http://localhost:3002',
          ws: true,
          changeOrigin: true
        },
        '/api/health': {
          target: 'http://localhost:3002',
          changeOrigin: true
        },
        '/api/tools': {
          target: 'http://localhost:3002',
          changeOrigin: true
        }
      } : {}
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, '../packages/shared-types'),
        '@next': path.resolve(__dirname, '../frontend_next/src')
      }
    }
  }
})
