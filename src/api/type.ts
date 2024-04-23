export interface ResponseData<T> {
  code: number
  message: string
  ok: boolean
  data: T
}

// 品牌响应数据类型定义
export * from './product/trademark/type'
// 分类响应数据类型定义
export * from './product/attr/type'
