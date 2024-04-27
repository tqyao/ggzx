// 定义响应数据类型
export interface ResponseData<T> {
  code: number
  message: string
  ok: boolean
  data: T
}

/**
 * 后端分页返回数据类型
 */
export interface PageDate<L> {
  records: L
  total: number
  size: number
  current: number
  searchCount: boolean
  pages: number
}

/**
 * 分页响应数据类型定义
 */
export interface ResponsePageData<L> extends ResponseData<PageDate<L>> {
  data: PageDate<L>
}

/*
// ①
interface Test {
  name: string
  age: number
}

const obj: ResponsePageData<Test[]> = {
  code: 111,
  message: 'string',
  ok: true,
  data: {
    records: [
      {
        name: '111',
        age: 22
      }
    ],
    total: 1,
    size: 1,
    current: 1,
    searchCount: true,
    pages: 1
  }
}

console.log(obj.data.current)
console.log(obj.data.records)*/

/*
// ②
export interface ResponsePageData<L, P extends PageDate<L>> extends ResponseData<P> {
  data: P
}

interface Test {
  name: string
  age: number
}

const obj2: ResponsePageData<Test[], PageDate<Test[]>> = {
  code: 111,
  message: 'string',
  ok: true,
  data: {
    records: [
      {
        name: '111',
        age: 22
      }
    ],
    total: 1,
    size: 1,
    current: 1,
    searchCount: true,
    pages: 1
  }
}
console.log(obj2.data.current)
console.log(obj2.data.records)
console.log(obj2.data.records[0].age)
*/

// 品牌响应数据类型定义
export * from './product/trademark/type'
// 分类响应数据类型定义
export * from './product/attr/type'
export * from './product/spu/type'
