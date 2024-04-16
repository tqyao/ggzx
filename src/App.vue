<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import SvgIcon from '@/components/SvgIcon/Index.vue'
console.log(import.meta.env)
</script>

<template>
  <!-- 国际化  -->
  <div>
    <h1>hello world</h1>
  </div>
  <el-config-provider :locale="zhCn">
    <div>
      <el-config-provider>
        <el-table mb-1 :data="[]" />
        <el-pagination :total="100" />
      </el-config-provider>
    </div>

    <hr />
    <svg style="width: 100px; height: 100px">
      <use xlink:href="#icon-phone" fill="yellow"></use>
    </svg>
    <hr />
    <svg-icon name="home" width="200px" height="300px" color="green"></svg-icon>
  </el-config-provider>
</template>

<style scoped lang="scss">
div {
  h1 {
    color: $base-color;
  }
}
</style>
