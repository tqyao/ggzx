<script setup lang="ts">
import { useLayOutSettingStore, useUserStore } from '@/store/index'
import { useRoute } from 'vue-router'

const layOutSettingStore = useLayOutSettingStore()
const $route = useRoute()
const userStore = useUserStore()

const logout = () => {}
defineOptions({
  name: 'TabbarIndex'
})
</script>

<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <!-- 菜单栏展开收起图标      -->
      <el-icon
        style="margin-left: 20px"
        @click="layOutSettingStore.fold = !layOutSettingStore.fold"
      >
        <component :is="layOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
      </el-icon>
      <!-- 面包屑导航      -->
      <el-breadcrumb :separator-icon="'ArrowRight'">
        <el-breadcrumb-item
          :to="{ path: item.path }"
          style="margin-left: 10px"
          v-for="(item, index) in $route.matched"
          v-show="!item.meta.hidden"
          :key="index"
        >
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabbar_right">
      <el-button size="small" icon="Refresh" circle></el-button>
      <el-button size="small" icon="FullScreen" circle></el-button>
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabbar {
  display: flex;
  justify-content: space-between;

  .tabbar_left {
    height: $base-tabbar-height;
    display: flex;
    align-items: center;
  }

  .tabbar_right {
    margin-right: 30px;
    display: flex;
    align-items: center;
  }
}
</style>
