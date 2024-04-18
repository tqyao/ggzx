import type { RouteRecordRaw } from 'vue-router'

export interface UserState {
  token: string | null
  username: string
  avatar: string
  // 菜单路由
  menuRoutes: RouteRecordRaw[]
}
