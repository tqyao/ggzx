/**
 * 路由鉴权：鉴权：项目当中路由能不能被访问的权限
 */

import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store'

// 跳转到登录页的函数
const redirectToLogin = (redirect: string) => ({ path: '/login', query: { redirect } })

// 关闭进度条后的小圆圈
NProgress.configure({ showSpinner: false })
// 路由前置守卫
router.beforeEach(async (to, from) => {
  NProgress.start()
  /*
  1.访问非 login？token 存在？
  2.不存在跳转到登录页
  3.token 存在，用户信息存在？放行
  4.用户信息不存在，发送请求获取用户信息，获取成功放行，获取失败清空用户信息，跳转到登录页
   */
  const userStore = useUserStore()

  if (to.path !== '/login') {
    // 访问非登录页，判断 token 是否存在
    if (!userStore.token) {
      // token 不存在，跳转到登录页
      // return { path: '/login', query: { redirect: to.path } }
      return redirectToLogin(to.path)
    }
    if (userStore.username) {
      // 用户信息存在，放行
      return true
    }
    // 用户信息不存在，发送请求获取用户信息
    try {
      await userStore.reqUserInfo()
      return true
    } catch (e) {
      // token 过期
      await userStore.logout()
      return redirectToLogin(to.path)
    }
  } else if (userStore.token) {
    // 访问登录页，用户信息存在，禁止跳转到 login
    try {
      await userStore.reqUserInfo()
      return { path: '/' }
    } catch (e) {
      // token 过期，
      userStore.clearUserInfo()
      return redirectToLogin(from.path)
    }
  } else {
    // 访问登录页，用户信息不存在，放行
    return true
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})
