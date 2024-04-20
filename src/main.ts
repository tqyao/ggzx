import { createApp } from 'vue'
import pinia from '@/store/index'
import globalComponent from '@/components'

import App from '@/App.vue'
import router from './router'
import 'virtual:svg-icons-register'
import '@/styles/index.scss'

// 引入路由鉴权
import '@/permisstion'


const app = createApp(App)

// 自定义插件
app.use(globalComponent)
app.use(pinia)
app.use(router)

app.mount('#app')
