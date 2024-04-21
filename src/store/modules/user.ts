//创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLoginServer, reqUserInfoServer, reqLogoutServer } from '@/api/user'
import type { LoginFormReqData, LoginResponseData, userInfoResponseData } from '@/api/user/type'
import type { UserState } from '@/store/modules/types/type'
import { GET_TOKEN, SET_TOKEN } from '@/utils/token'
import { constantRoute } from '@/router/router'
import defaultAvatar from '@/assets/images/default-user.png'

//创建用户小仓库
export const useUserStore = defineStore('User', {
  //小仓库存储数据地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      avatar: defaultAvatar,
      username: '',
      menuRoutes: constantRoute
    }
  },
  //处理异步|逻辑地方
  actions: {
    // 登录
    async userLogin(loginForm: LoginFormReqData) {
      const res: LoginResponseData = await reqLoginServer(loginForm)
      if (res.code === 200) {
        SET_TOKEN(res.data)
        this.token = res.data
        //async函数返回一个 Promise 对象，返回只要不是 Promise.reject(xxx) 即是成功
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data || res.message))
      }
    },
    // 请求用户信息
    async reqUserInfo() {
      const res: userInfoResponseData = await reqUserInfoServer()
      // console.log('store', res,'end')
      if (res.code === 200) {
        console.log(res)
        this.username = res.data.name
        this.avatar = res.data.avatar || defaultAvatar
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    clearUserInfo() {
      this.token = ''
      this.username = ''
      this.avatar = ''
      SET_TOKEN('')
    },
    // 退出登录
    async logout() {
      const res = await reqLogoutServer()
      if (res.code === 200) {
        this.clearUserInfo()
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    }
  },
  getters: {}
})
// //对外暴露小仓库
// export default useUserStore
