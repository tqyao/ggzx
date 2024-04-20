/**
 * 路由鉴权：鉴权：项目当中路由能不能被访问的权限
 */

import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 关闭进度条后的小圆圈
NProgress.configure({ showSpinner: false })
// 路由前置收尾
router.beforeEach((to, from, next) => {
  NProgress.start()

  next()
})

router.afterEach((to, from, next) => {
  NProgress.done()
})
