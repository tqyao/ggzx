<script setup lang="ts"></script>

<template>
  <div>
    <el-sub-menu index="1">
      <template #title>
        <span>图标 nav1</span>
      </template>
      <el-menu-item index="1-1">item one</el-menu-item>
      <el-sub-menu index="1-2">
        <template #title>item four</template>
        <el-menu-item index="1-2-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item>
      <span>图标 nav2</span>
    </el-menu-item>
  </div>
</template>

<style scoped lang="scss"></style>
