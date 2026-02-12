import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

// Mock 模式日志
if (import.meta.env.VITE_USE_MOCK === 'true') {
  console.log('[Mock] 模式已启用，API 请求将发送到 mock-server')
}

const app = createApp(App)

// 使用 Element Plus，使用 namespace 隔离样式
app.use(ElementPlus, {
  namespace: 'ep-chat'
})

app.mount('#app')
