export interface ResponseData<T> {
  code: number
  message: string
  ok: boolean
  data: T
}

export * from './product/trademark/type'
