<script setup lang="ts">
import { useLayOutSettingStore } from '@/store/index'
import { useRoute } from 'vue-router'

const layOutSettingStore = useLayOutSettingStore()
const $route = useRoute()

defineOptions({
  name: 'BreadcrumbIndex'
})
</script>

<template>
  <!-- 菜单栏展开收起图标      -->
  <el-icon style="margin-left: 20px" @click="layOutSettingStore.fold = !layOutSettingStore.fold">
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
</template>

<style scoped lang="scss"></style>
