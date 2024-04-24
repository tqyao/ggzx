<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/store/modules/category'

defineProps({
  // 控制分类下拉框是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

// 获取分类仓库
const categoryStore = useCategoryStore()
// 页面挂载时获取1 级分类列表
onMounted(() => {
  getC1Arr()
})
// 请求仓库发起获取一级分类
const getC1Arr = () => {
  categoryStore.getC1Arr()
}

// 一级分类发生变化时触发回调
const handleC1Change = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c2Arr = []
  categoryStore.c3Arr = []
  categoryStore.getC2Arr()
}

// 二级分类发生变化时触发回调
const handleC2Change = () => {
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.getC3Arr()
}

defineOptions({
  name: 'CategoryComponent'
})
</script>
<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select
          :disabled="disabled || !(categoryStore.c1Arr && categoryStore.c1Arr.length > 0)"
          style="width: 170px"
          v-model="categoryStore.c1Id"
          @change="handleC1Change"
        >
          <el-option
            v-for="c1 of categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="disabled || !(categoryStore.c2Arr && categoryStore.c2Arr.length > 0)"
          style="width: 170px"
          v-model="categoryStore.c2Id"
          @change="handleC2Change"
        >
          <el-option
            v-for="c2 of categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="disabled || !(categoryStore.c3Arr && categoryStore.c3Arr.length > 0)"
          style="width: 170px"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="c3 of categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped></style>
