<script setup lang="ts">
import { useCategoryStore } from '@/store/modules/category'
import { watch, ref, onBeforeUnmount, watchEffect } from 'vue'
import { reqAttr, reqRemoveAttr } from '@/api/product/attr'
import type { Attr, AttrList } from '@/api/product/attr/type'
import { storeToRefs } from 'pinia'
import EditProp from '@/views/product/attr/componments/EditProp.vue'

const loading = ref(false)
const categoryStore = useCategoryStore()
// 属性列表
const attrList = ref<AttrList>([])

const getAttrFn = async () => {
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
      getAttrFn()
    }
  }
)

// 控制显示列表 or 编辑/添加属性表单 默认 false：展示三级分类下的属性列表
const toggleAttrListOrEdit = ref(false)

/*
为了获取 EditProp 的类型，我们首先需要通过 typeof 得到其类型
，再使用 TypeScript 内置的 InstanceType 工具类型来获取其实例类型
 */
const editPropRef = ref<InstanceType<typeof EditProp>>()
// 点击添加属性回调
const addAttrFn = () => {
  // 传递 三级分类id和分类 level 给子组件
  editPropRef.value.open({
    categoryId: categoryStore.c3Id,
    categoryLevel: 3
  })
}

// 点击编辑属性名所属的属性值回调
const editAttrFn = (row: Attr) => {
  editPropRef.value.open(row)
}

const delAttrFn = async (attrId: number) => {
  await ElMessageBox.confirm('是否确认删除该属性值', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await reqRemoveAttr(attrId)
  ElMessage.success('删除成功')
  getAttrFn()
}
// 监听子组件 success 事件处理函数
const handleSuccess = () => {
  // 重新获取属性键值列表
  getAttrFn()
}

// 监听三级分类的id变化，分类切换时清空属性键值数据，c3Id 存在则请求属性数据
watchEffect(() => {
  if (categoryStore.c3Id) {
    getAttrFn()
  } else {
    // 清空仓库分类相关的数据
    attrList.value = []
  }
})

//  路由组件销毁的时候，把仓库分类相关的数据清空
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
    <!-- 三级分类全局组件 如果toggleAttrListOrEdit=ture 则添加某个三级分类下其属性键值，分类选项卡应该禁用-->
    <Category :disabled="toggleAttrListOrEdit"></Category>
    <el-card style="margin: 10px 0px">
      <!--  三级分类小所属属性键与属性值展示 table  -->
      <div v-show="!toggleAttrListOrEdit">
        <el-button
          @click="addAttrFn"
          :disabled="!categoryStore.c3Id"
          type="primary"
          size="default"
          icon="Plus"
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
            <template #default="{ row }">
              <el-button
                @click="editAttrFn(row)"
                type="warning"
                size="small"
                icon="Edit"
              ></el-button>
              <el-button
                @click="delAttrFn(row.id)"
                type="danger"
                size="small"
                icon="Delete"
              ></el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无数据" />
          </template>
        </el-table>
      </div>
      <!--  添加/编辑属性表单   -->
      <edit-prop
        ref="editPropRef"
        @success="handleSuccess"
        v-model:edit-visible="toggleAttrListOrEdit"
      ></edit-prop>
    </el-card>
  </div>
</template>

<style scoped lang="scss"></style>
