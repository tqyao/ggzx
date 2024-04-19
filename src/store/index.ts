//仓库大仓库
import { createPinia } from 'pinia'
//创建大仓库
const pinia = createPinia()
//对外暴露：入口文件需要安装仓库
export default pinia

// 引入总仓库再导出
export * from './modules/user'
export * from './modules/setting'
