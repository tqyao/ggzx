import { createApp } from 'vue'
import { createPinia } from 'pinia'
import globalComponent from '@/components/Index'

import App from '@/App.vue'
import router from './router'
import 'virtual:svg-icons-register'
import '@/styles/index.scss'

const app = createApp(App)

// 自定义插件
app.use(globalComponent)
app.use(createPinia())
app.use(router)

app.mount('#app')
