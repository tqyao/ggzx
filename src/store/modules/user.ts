//创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user'
import type { loginFormData, loginResponseData } from '@/api/user/type'
import type { UserState } from '@/store/modules/types/type'
import { GET_TOKEN, SET_TOKEN } from '@/utils/token'


//创建用户小仓库
export const useUserStore = defineStore('User', {
  //小仓库存储数据地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      avatar: '',
      username: ''
    }
  },
  //处理异步|逻辑地方
  actions: {
    // 登录
    async userLogin(loginForm: loginFormData) {
      const res: loginResponseData = await reqLogin(loginForm)
      if (res.code === 200) {
        SET_TOKEN(res.data.token as string)
        this.token = <string>res.data.token
        //async函数返回一个 Promise 对象，返回只要不是 Promise.reject(xxx) 即是成功
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data.message))
      }
    }
  },
  getters: {}
})
// //对外暴露小仓库
// export default useUserStore
