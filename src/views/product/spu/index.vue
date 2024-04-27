<script setup lang="ts">
defineOptions({
  name: 'SpuIndex'
})
</script>

<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 10px">
      <el-button type="primary" size="default" icon="Plus">添加SPU</el-button>
      <el-table border style="margin: 10px 10px">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="SPU名称"></el-table-column>
        <el-table-column label="SPU描述"></el-table-column>
        <el-table-column label="SPU操作"></el-table-column>
      </el-table>
    </el-card>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="400"
    />
  </div>
</template>

<style scoped lang="scss"></style>
