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

// 请求失败返回的错误信息
interface dataType {
  message?: string
}

/**
 * 定义登录接口返回数据类型
 */
export interface loginResponseData extends ResponseData {
  data: dataType & { token: string }
}

/**
 * 定义获取用户信息返回数据类型
 */
export interface userInfoResponseData extends ResponseData {
  data: dataType & {
    checkUser:{
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
}
