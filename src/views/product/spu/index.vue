<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCategoryStore } from '@/store'
import type { SkuData, SpuData } from '@/api/product/spu/type'
import { reqHasSpuServer, reqRemoveSpuServer, reqSkuListServer } from '@/api/product/spu'
import SkuForm from '@/views/product/spu/componments/SkuForm.vue'
import SpuForm from '@/views/product/spu/componments/SpuForm.vue'

// !用于测试
onMounted(() => {
  setTimeout(() => {
    categoryStore.c1Id = 2
    setTimeout(() => {
      categoryStore.c2Id = 13
      setTimeout(() => {
        categoryStore.c3Id = 61
        getSpuPageFn()
      }, 100)
    }, 200)
  }, 1000)
})

// 场景切换 0:spu列表；1：添加修改 spu；2：添加修改 sku
const scen = ref(0)

const pageNo = ref(1)
const pageSize = ref(3)
const total = ref(0)
const categoryStore = useCategoryStore()
const spuPageDate = ref<SpuData[]>([])
// 获取SPU分页列表
const getSpuPageFn = async (page = 1) => {
  pageNo.value = page
  const resp = await reqHasSpuServer(pageNo.value, pageSize.value, categoryStore.c3Id)
  total.value = resp.data.total
  spuPageDate.value = resp.data.records
}

watch(
  () => categoryStore.c3Id,
  (newC3Id) => {
    // 三级 id 变化，清空页面残留的spu分页数据
    if (!newC3Id) {
      spuPageDate.value = []
      return
    }
    getSpuPageFn()
  }
)
const spuFormRef = ref<InstanceType<typeof SpuForm> | null>(null)
const addSpuFn = () => {
  scen.value = 1
  spuFormRef.value?.open({ category3Id: categoryStore.c3Id } as SpuData)
}
const skuFormRef = ref<InstanceType<typeof SkuForm> | null>(null)
const addSkuFn = (row: SpuData) => {
  scen.value = 2
  skuFormRef.value?.open(categoryStore.c1Id, categoryStore.c2Id, {
    ...row,
    kind: 'SpuData'
  })
}
const editSpuFn = (row: SpuData) => {
  scen.value = 1
  spuFormRef.value?.open(row)
}
const handleSpuClose = (optType: 'update' | 'add') => {
  scen.value = 0
  if (optType === 'update') {
    getSpuPageFn(pageNo.value)
    return
  }
  if (optType === 'add') {
    getSpuPageFn()
  }
}
const handleSkuClose = () => {
  scen.value = 0
}

const deleteSpuFn = async (spuId: string | number) => {
  await reqRemoveSpuServer(spuId)
  ElMessage.success('删除成功')
  const totalPage = Math.ceil((total.value - 1) / pageSize.value)
  const page = totalPage > pageNo.value ? pageNo.value : totalPage
  await getSpuPageFn(page)
}

const show = ref<boolean>(false)
const skuArr = ref<SkuData[]>()
const lookSkuList = async (row: SpuData) => {
  const resp = await reqSkuListServer(row.id as number)
  skuArr.value = resp.data
  show.value = true
}

onBeforeUnmount(() => {
  //清空仓库的数据
  categoryStore.$reset()
})

defineOptions({
  name: 'SpuIndex'
})
</script>

<template>
  <div>
    <!-- 三级分类 -->
    <Category :disabled="scen !== 0"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scen === 0" class="spu-list">
        <el-button @click="addSpuFn" type="primary" size="default" icon="Plus">添加SPU</el-button>
        <el-table :data="spuPageDate" border style="margin: 10px 0px">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称"></el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <template #default="{ row, $index }">
              <el-button
                @click="addSkuFn(row)"
                type="primary"
                size="small"
                title="添加 SKU"
                icon="Plus"
              ></el-button>
              <el-button
                @click="editSpuFn(row)"
                type="warning"
                size="small"
                title="修改 SPU"
                icon="Edit"
              ></el-button>
              <el-button
                @click="lookSkuList(row)"
                type="success"
                size="small"
                title="查看 SKU 列表"
                icon="View"
              ></el-button>
              <el-popconfirm @confirm="deleteSpuFn(row.id)" :title="`你确定删除${row.spuName}?`">
                <template #reference>
                  <el-button type="danger" size="small" title="删除 SPU" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <!-- 默认的  @current-change 后面的处理函数会在事件触发时调用，并传入参数
          @size-change 同理
          -->
        <el-pagination
          @current-change="getSpuPageFn"
          @size-change="() => getSpuPageFn()"
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout=" prev, pager, next, jumper,->, sizes,total"
          :total="total"
        />
      </div>
      <spu-form @close="handleSpuClose" ref="spuFormRef" v-show="scen === 1"></spu-form>
      <sku-form @close="handleSkuClose" ref="skuFormRef" v-show="scen === 2"></sku-form>
      <!-- dialog对话框:展示已有的SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #default="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<style scoped lang="scss"></style>
