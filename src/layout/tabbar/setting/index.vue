<script setup lang="ts">
import { useUserStore, useLayOutSettingStore } from '@/store'

const userStore = useUserStore()
const layOutSettingStore = useLayOutSettingStore()

// 点击刷新按钮回调
const reFreshFn = () => {
  layOutSettingStore.refresh = !layOutSettingStore.refresh
}
//全屏按钮点击的回调
const fullScreenFn = () => {
  //DOM对象的一个属性:可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
  let full = document.fullscreenElement
  //切换为全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //变为不是全屏模式->退出全屏模式
    document.exitFullscreen()
  }
}

const logout = () => {}

defineOptions({
  name: 'SettingIndex'
})
</script>

<template>
  <el-button @click="reFreshFn" size="small" icon="Refresh" circle></el-button>
  <el-button @click="fullScreenFn" size="small" icon="FullScreen" circle></el-button>
  <el-button size="small" icon="Setting" circle></el-button>

  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px 0 20px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss"></style>
