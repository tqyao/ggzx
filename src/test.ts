// import type * as MyType from '@/api/product/trademark/index.ts'
// export type { TradeMark } from '@/api/product/trademark/type'
// import { reqHasTrademarkServer } from '@/api/product/trademark'
// import { reqHasTrademarkServer,type TradeMark } from '@/api/product/trademark'
import { reqHasTrademarkServer } from '@/api/product/trademark'
import type { TradeMark } from '@/api/type'

console.log('test start >>>>>>>>>>>>>>>>>>>>>>>>>>>>')
const tp: TradeMark = {
  id: 101,
  logoUrl: 'http://haha',
  tmName: 'string'
}
console.log(tp)

const req = async () => {
  const resp = await reqHasTrademarkServer(1, 3)
  console.log('test@@@', resp)
}
req()

console.log('test end >>>>>>>>>>>>>>>>>>>>>>>>>>>>')
