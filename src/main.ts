import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { useAuthStore } from './stores/authStore'

// Mock 模式日志
if (import.meta.env.VITE_USE_MOCK === 'true') {
  console.log('[Mock] 模式已启用，API 请求将发送到 mock-server')
}

const app = createApp(App)
const pinia = createPinia()

// 使用 Pinia 状态管理
app.use(pinia)

// 初始化用户身份
const authStore = useAuthStore();
authStore.initializeUser();

// 使用 Element Plus，使用 namespace 隔离样式
app.use(ElementPlus)

app.mount('#app')
