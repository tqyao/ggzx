import type { RouteRecordRaw } from 'vue-router'
import type { CategoryObjList } from '@/api/type'
import type { Ref } from 'vue'

// 用户状态
export interface UserState {
  token: string | null
  username: string
  avatar: string
  // 菜单路由
  menuRoutes: RouteRecordRaw[]
}

// 分类状态
export interface CategoryState {
  // 1级分类列表
  c1Arr: Ref<CategoryObjList>
  // 选中的 1 级分类 id
  c1Id: Ref<string | number>
  // 获取 1 级分类列表
  getC1Arr: () => void
  // 2级分类列表
  c2Arr: Ref<CategoryObjList>
  // 选中的 2 级分类 id
  c2Id: Ref<string | number>
  // 获取 2 级分类列表
  getC2Arr: () => void
  // 3级分类列表
  c3Arr: Ref<CategoryObjList>
  // 选中的 3 级分类 id
  c3Id: Ref<string | number>
  // 获取 3 级分类列表
  getC3Arr: () => void
}
