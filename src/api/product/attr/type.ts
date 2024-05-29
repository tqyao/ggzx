// 分类响应数据类型定义

// 1、2、3 级分类数组
export type CategoryObjList = CategoryObj[]

//相应的分类接口返回数据的类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

//属性与属性值的ts类型

//属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}

//存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]

//属性对象
export interface Attr {
  id?: number
  attrName?: string
  categoryId: number | string
  categoryLevel: number
  attrValueList?: AttrValueList
  attrIdAndValueId?:string  // select 选中后双向数据绑定值
}

//存储每一个属性对象的数组ts类型
export type AttrList = Attr[]

