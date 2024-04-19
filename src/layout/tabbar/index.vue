<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'

defineOptions({
  name: 'TabbarIndex'
})
</script>

<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
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
