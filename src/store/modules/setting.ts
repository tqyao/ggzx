import { defineStore } from 'pinia'

export const useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      // 菜单是是否折叠
      fold: false,
      // 是否刷新
      refresh: false
    }
  }
})
