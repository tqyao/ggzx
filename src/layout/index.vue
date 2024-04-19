<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import { useUserStore } from '@/store'
import { useRoute } from 'vue-router'
import { useLayOutSettingStore } from '@/store'
import { onMounted } from 'vue'

const userStore = useUserStore()
const $route = useRoute()
const layOutSettingStore = useLayOutSettingStore()

onMounted(async () => {
  // try {
  //   await userStore.reqUserInfo()
  // } catch (e) {
  //   console.log((e as Error).message)
  // }

  await userStore.reqUserInfo().catch((error) => {
    ElNotification({
      title: '错误',
      message: error.message,
      type: 'error'
    })
  })
})

defineOptions({
  name: 'LayoutIndex'
})
</script>

<template>
  <div class="layout_container">
    <!-- 左侧菜单栏    -->
    <div class="layout_slider" :class="{ fold: layOutSettingStore.fold }">
      <Logo :titleVisible="!layOutSettingStore.fold"></Logo>
      <!-- 滚动条      -->
      <el-scrollbar class="scrollbar">
        <el-menu
          :collapse="layOutSettingStore.fold"
          :default-active="$route.path"
          background-color="#001529"
          text-color="white"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部菜单栏    -->
    <div class="layout_tabbar" :class="{ fold: layOutSettingStore.fold }">
      <Tabbar></Tabbar>
    </div>
    <!-- 主体内容展示   -->
    <div class="layout_main" :class="{ fold: layOutSettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;

    &.fold {
      width: $base-menu-min-width;
      transition: all 0.3s;
    }

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    //background: linear-gradient(to right, #464b50, #882222);
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background-color: yellowgreen;
    top: $base-tabbar-height;
    left: $base-menu-width;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
