//定义用户相关数据的ts类型

/**
 * 定义用登录请求数据类型
 */
export interface loginFormData {
  username: string
  password: string
}

/**
 * 通用响应数据类型
 */
export interface ResponseData {
  code: number
}

export interface dataType {
  token?: string
  message?: string
}

/**
 * 定义登录接口返回数据类型
 */
export interface loginResponseData extends ResponseData {
  data: dataType
}

/**
 * 定义获取用户信息返回数据类型
 */
export interface userInfoResponseData extends ResponseData {
  data: {
    userId: number
    avatar: string
    username: string
    password: string
    desc: string
    roles: string[]
    buttons: string[]
    routes: string[]
    token: string
  }
}
