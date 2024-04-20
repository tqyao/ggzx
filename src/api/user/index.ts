import request from '@/utils/request'
import type { LoginFormReqData, LoginResponseData, userInfoResponseData } from './type'

enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout'
}

//登录接口
export const reqLoginServer = (data: LoginFormReqData) =>
  request.post<any, LoginResponseData>(API.LOGIN_URL, data)
//获取用户信息
export const reqUserInfoServer = () => request.get<any, userInfoResponseData>(API.USERINFO_URL)
//退出登录
export const reqLogoutServer = () => request.post<any, any>(API.LOGOUT_URL)
