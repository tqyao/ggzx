<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqHasTrademarkServer, reqDeleteTrademarkServer } from '@/api/product/trademark'
import type { TradeMark, Records } from '@/api/type'
import TrademarkEdit from '@/views/product/trademark/components/TrademarkEdit.vue'

// 当前页
const pageNo = ref(1)
// 每页条数
const limit = ref(3)
// 总记录数
const total = ref(0)
// 品牌列表
const trademarkList = ref<TradeMark[]>([])

/**
 * 获取品牌列表数据
 * 分页组件侦查到页数发生改变会触发current-change事件并附带页码参数，当前函数为监听current-change的回调函数
 * @param paper 第几页数据，如果不传，则页码为 1。例如页码改变应该不传参数，让页码为 1
 *
 */
const getHasTrademark = async (paper = 1) => {
  pageNo.value = paper
  const resp = await reqHasTrademarkServer(pageNo.value, limit.value)
  trademarkList.value = resp.data.records
  total.value = resp.data.total
}

onMounted(() => {
  getHasTrademark()
})

/**
 *  每页展示条数改变回调
 * </br>
 *  由于使用的是v-model:page-size双向绑定数据，
 *  默认的组件会接受page-size参数，并触发update:page-size事件，当前函数为监听@update:page-size事件的回调函数
 *  </br>
 *  v-model:current-page="pageNo" 也同理
 */
const sizeChange = () => {
  getHasTrademark()
}

// 编辑品牌Ref
const trademarkEditRef = ref()
const addTrademarkFn = () => {
  trademarkEditRef.value.open()
}
// 编辑品牌回调
const editTrademarkFn = (row: TradeMark) => {
  console.log(row.id)
  trademarkEditRef.value.open(row)
}
// 删除品牌回调
const delTrademarkFn = async (row: TradeMark) => {
  await reqDeleteTrademarkServer(row.id as number)
  // 当前也数据大于 1，重新获取当前页数据，否则获取上一页的品牌数据
  await getHasTrademark(trademarkList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  ElMessage.success('删除成功')
}

// 添加品牌/编辑成功回调
const handleSuccess = (isEdit: 'edit' | 'add') => {
  if (isEdit === 'edit') {
    getHasTrademark(pageNo.value)
  } else {
    // 最后一页
    const lastPage = Math.ceil((total.value + 1) / limit.value)
    getHasTrademark(lastPage)
  }
}

defineOptions({
  name: 'TrademarkIndex'
})
</script>

<template>
  <el-card>
    <el-button @click="addTrademarkFn" icon="Plus" type="primary">添加品牌</el-button>
    <el-table stripe style="margin: 10px 0" :data="trademarkList" border>
      <el-table-column align="center" label="序号" type="index" width="80" />
      <el-table-column align="center" label="品牌名称" prop="tmName" />
      <el-table-column align="center" label="品牌logo" prop="logoUrl">
        <template #default="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-button @click="editTrademarkFn(row)" icon="Edit" type="warning"></el-button>
          <el-button @click="delTrademarkFn(row)" icon="Delete" type="danger"></el-button>
        </template>
      </el-table-column>
      <!-- 空状态 -->
      <template #empty>
        <el-empty description="description" />
      </template>
    </el-table>
    <!-- 分页器组件
    pagination
       v-model:current-page:设置分页器当前页码
       v-model:page-size:设置每一个展示数据条数
       page-sizes:用于设置下拉菜单数据
       background:设置分页器按钮的背景颜色
       layout:可以设置分页器六个子组件布局调整
-->
    <el-pagination
      @size-change="sizeChange"
      @current-change="getHasTrademark"
      :pager-count="9"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    />
    <!-- 对话框    -->
    <TrademarkEdit @success="handleSuccess" ref="trademarkEditRef"></TrademarkEdit>
  </el-card>
</template>

<style scoped lang="scss"></style>
