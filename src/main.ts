import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import './styles/index.css'
import App from './App.vue'
import router from './router'
import { registerIcons } from './utils/icons'

const app = createApp(App)

// 注册常用图标（按需引入，非全量）
registerIcons(app)

app.use(createPinia())
app.use(router)

app.mount('#app')
