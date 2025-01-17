//SPU管理模块的接口
import request from '@/utils/request'

import type { TradeMark } from '@/api/product/trademark/type'
import type { HasSaleAttr, SaleAttr, SkuData, SpuData, SpuImg } from './type'
import type { ResponsePageData, ResponseData } from '@/api/type'

enum API {
  //获取已有的SPU的数据
  HASSPU_URL = '/admin/product/',
  //获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取某个SPU下的全部的售卖商品的图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  //获取某一个SPU下全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //追加一个新的SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //更新已有的SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //追加一个新增的SKU地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //查看某一个已有的SPU下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSpu/'
}

//获取某一个三级分类下已有的SPU数据
export const reqHasSpuServer = (page: number, limit: number, category3Id: string | number) =>
  request.get<any, ResponsePageData<SpuData[]>>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`
  )
//获取全部的SPU的品牌的数据
export const reqAllTradeMarkServer = () =>
  request.get<any, ResponseData<TradeMark[]>>(API.ALLTRADEMARK_URL)
//获取某一个已有的SPU下全部商品的图片地址
export const reqSpuImageListServer = (spuId: number) =>
  request.get<any, ResponseData<SpuImg[]>>(API.IMAGE_URL + spuId)
//获取某一个已有的SPU拥有多少个销售属性
export const reqSpuHasSaleAttrServer = (spuId: number) =>
  request.get<any, ResponseData<SaleAttr[]>>(API.SPUHASSALEATTR_URL + spuId)
//获取全部的销售属性
export const reqAllSaleAttrServer = () =>
  request.get<any, ResponseData<HasSaleAttr[]>>(API.ALLSALEATTR_URL)
//添加一个新的SPU的
//更新已有的SPU接口
//data:即为新增的SPU|或者已有的SPU对象
export const reqAddOrUpdateSpuServer = (data: SpuData) => {
  //如果SPU对象拥有ID,更新已有的SPU
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}
//添加SKU的请求方法
export const reqAddSkuServer = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)

//获取SKU列表数据
export const reqSkuListServer = (spuId: number | string) =>
  request.get<any, ResponseData<SkuData[]>>(API.SKUINFO_URL + spuId)

//删除已有的SPU
export const reqRemoveSpuServer = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId)
