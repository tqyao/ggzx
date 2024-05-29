//SKU模块接口管理
import request from '@/utils/request'
import type { ResponseData, ResponsePageData } from '@/api/type'
import type { SkuData } from '@/api/product/sku/type'

//枚举地址
enum API {
  //获取已有的商品的数据-SKU
  SKU_URL = '/admin/product/list/',
  //上架
  SALE_URL = '/admin/product/onSale/',
  //下架的接口
  CANCELSALE_URL = '/admin/product/cancelSale/',
  //获取商品详情的接口
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  //删除已有的商品
  DELETESKU_URL = '/admin/product/deleteSku/'
}

//获取商品SKU的接口
export const reqSkuListServer = (page: number, limit: number) =>
  request.get<any, ResponsePageData<SkuData>>(API.SKU_URL + `${page}/${limit}`)
//已有商品上架的请求
export const reqSaleSkuServer = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId)
//下架的请求
export const reqCancelSaleServer = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)
//获取商品详情的接口
export const reqSkuInfoServer = (skuId: number) =>
  request.get<any, ResponseData<SkuData>>(API.SKUINFO_URL + skuId)
//删除某一个已有的商品
export const reqRemoveSkuServer = (skuId: number) =>
  request.delete<any, any>(API.DELETESKU_URL + skuId)
