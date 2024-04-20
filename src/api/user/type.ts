//定义用户相关数据的ts类型

/**
 * 定义用登录请求数据类型
 */
export interface LoginFormReqData {
  username: string
  password: string
}

/**
 * 通用响应数据类型
 */
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

/**
 * 定义登录接口返回数据类型
 */
export interface LoginResponseData extends ResponseData {
  data: string
}

/**
 * 定义获取用户信息返回数据类型
 */
export interface userInfoResponseData extends ResponseData {
  data: {
    name: string
    avatar: string
    roles: string[]
    buttons: string[]
    routes: string[]
  }
}
