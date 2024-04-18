<script setup lang="ts">
import Logo from './logo/index.vue'
</script>

<template>
  <div class="layout_container">
    <!-- 左侧菜单栏    -->
    <div class="layout_slider">
      <Logo></Logo>
    </div>
    <!-- 顶部菜单栏    -->
    <div class="layout_tabbar"></div>
    <!-- 主体内容展示   -->
    <div class="layout_main">

    </div>
  </div>
</template>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  //background-color: ;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background: cyan;
    top: 0;
    left: $base-menu-width;
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
  }
}
</style>
