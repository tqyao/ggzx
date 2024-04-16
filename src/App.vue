<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <!-- 国际化  -->
  <el-config-provider :locale="zhCn">
    <div>
      <el-config-provider>
        <el-table mb-1 :data="[]" />
        <el-pagination :total="100" />
      </el-config-provider>
    </div>
  </el-config-provider>
</template>

<style scoped></style>
