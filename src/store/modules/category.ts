import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CategoryObjList } from '@/api/type'
import type { CategoryState } from '@/store/modules/types/type'
import { reqC1Server, reqC2Server, reqC3Server } from '@/api/product/attr'

export const useCategoryStore = defineStore('CategoryStore', (): CategoryState => {
  // 1级分类列表处理
  const c1Arr = ref<CategoryObjList>([])
  const c1Id = ref<string | number>('')
  const getC1Arr = async () => {
    const { data } = await reqC1Server()
    c1Arr.value = data
  }

  // 2级分类列表处理
  const c2Arr = ref<CategoryObjList>([])
  const c2Id = ref<string | number>('')
  const getC2Arr = async () => {
    const { data } = await reqC2Server(c1Id.value)
    c2Arr.value = data
  }

  // 3级分类列表处理
  const c3Arr = ref<CategoryObjList>([])
  const c3Id = ref<string | number>('')
  const getC3Arr = async () => {
    const { data } = await reqC3Server(c2Id.value)
    c3Arr.value = data
  }

  // 在 Setup Stores 中，您需要创建自己的 $reset() 方法，重置数据
  const $reset = () => {
    c1Arr.value = []
    c1Id.value = ''
    c2Arr.value = []
    c2Id.value = ''
    c3Arr.value = []
    c3Id.value = ''
  }

  return {
    c1Arr,
    c1Id,
    getC1Arr,
    c2Arr,
    c2Id,
    getC2Arr,
    c3Arr,
    c3Id,
    getC3Arr,
    $reset
  }
})
