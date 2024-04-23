<script setup lang="ts">
import { useCategoryStore } from '@/store/modules/category'
import { watch, ref, onBeforeUnmount } from 'vue'
import { reqAttr } from '@/api/product/attr'
import type { AttrList } from '@/api/product/attr/type'
import { storeToRefs } from 'pinia'

const loading = ref(false)
const categoryStore = useCategoryStore()
// 属性列表
const attrList = ref<AttrList>([])

const getAttr = async () => {
  //从 store 中提取属性时保持其响应性，你需要使用 storeToRefs()。它将为每一个响应式属性创建引用
  const { c1Id, c2Id, c3Id } = storeToRefs(categoryStore)
  const { data } = await reqAttr(c1Id.value, c2Id.value, c3Id.value)
  loading.value = false
  attrList.value = data
}

watch(
  () => categoryStore.c3Id,
  async (newVal) => {
    //如果三级分类有值，证明选中了三级分类，则可以请求属性列表数据
    if (newVal) {
      //清空上一次查询的属性与属性值，以防选择不同分类时，请求出现异常，展示了上一次请求的属性和值
      attrList.value = []
      loading.value = true
      //请求数据
      getAttr()
    }
  }
)
//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  categoryStore.$reset()
})

defineOptions({
  name: 'AttrIndex'
})
</script>

<template>
  <div class="attr-container">
    <!-- 三级分类全局组件-->
    <Category></Category>
    <el-card style="margin: 10px 0px">
      <el-button :disabled="!categoryStore.c3Id" type="primary" size="default" icon="Plus"
        >添加属性
      </el-button>
      <el-table v-loading="loading" :data="attrList" border style="margin: 10px 0px">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column prop="attrName" label="属性名" width="120px"></el-table-column>
        <el-table-column prop="" label="属性值">
          <template #default="{ row }">
            <el-tag
              v-for="item in row.attrValueList"
              :key="item.id"
              type="success"
              size="small"
              style="margin: 0px 5px"
            >
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170px">
          <el-button type="warning" size="small" icon="Edit"></el-button>
          <el-button type="danger" size="small" icon="Delete"></el-button>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss"></style>
