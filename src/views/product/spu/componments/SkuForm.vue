<script setup lang="ts">
import type { SaleAttr, SaleAttrValue, SpuData, SpuImg } from '@/api/product/spu/type'
import type { SkuData } from '@/api/product/sku/type'
import type { Attr } from '@/api/product/attr/type'
import { ref } from 'vue'
import { reqAttr } from '@/api/product/attr'
import { reqAddSkuServer, reqSpuHasSaleAttrServer, reqSpuImageListServer } from '@/api/product/spu'
import { ElTable } from 'element-plus'

const skuParams = ref<SkuData>({
  kind: 'SkuData',
  category3Id: '', //三级分类的ID
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID
  skuName: '', //sku名字
  price: '', //sku价格
  weight: '', //sku重量
  skuDesc: '', //sku的描述
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '', //sku图片地址
  isSale: 0 //控制商品的上架与下架
})

const sukFormRules = {
  skuName: [{ required: true, message: '请输入SKU名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入SKU价格', trigger: 'blur' }],
  // weight: [{ required: true, message: '请输入SKU重量', trigger: 'blur' }],
  skuDesc: [{ required: true, message: '请输入SKU描述', trigger: 'blur' }]
}

// 平台属性
const attrList = ref<Attr[]>()
// 销售属性
const saleAttrList = ref<SaleAttr[]>()
// sku 相册
const imageList = ref<SpuImg[]>()

type Kind = SkuData | SpuData
const open = async (c1Id: number | string, c2Id: number | string, row: Kind) => {
  skuParams.value = {}
  if (row.kind === 'SkuData') {
    // todo 修改 sku
    skuParams.value = {
      ...row
    }
  }
  if (row.kind === 'SpuData') {
    // 新增 sku
    skuParams.value = {
      ...row,
      kind: 'SkuData',
      id: undefined,
      spuId: row.id
    }
  }

  // 获取平台属性
  const resp = await reqAttr(c1Id, c2Id, row.category3Id as number)
  // 获取该 sku 所属的 spu 的所有销售属性
  const resp2 = await reqSpuHasSaleAttrServer(skuParams.value.spuId as number)
  // 获取该 sku 所属 spu 的所有图片
  const resp3 = await reqSpuImageListServer(skuParams.value.spuId as number)
  attrList.value = resp.data
  saleAttrList.value = resp2.data
  imageList.value = resp3.data
}
// open(2, 13, { kind: 'SpuData', category3Id: 61, id: 12267 } as SpuData)
// open({
//   kind: 'SpuData',
//   category3Id: 61,
//   id: 101,
//   spuName: 'string',
//   tmId: 10,
//   description: 'string',
//   spuImageList: [],
//   spuSaleAttrList: []
// })

const imgFormRef = ref<InstanceType<typeof ElTable> | null>(null)
const setDefaultFn = (row: SpuImg) => {
  imgFormRef.value?.clearSelection()
  // 设置默认图片
  imgFormRef.value?.toggleRowSelection(row, true)
  skuParams.value.skuDefaultImg = row.imgUrl
}
const handleImgSelect = (selected: SpuImg[], row: SpuImg) => {
  setDefaultFn(row)
}
const handleSelectAll = () => {
  imgFormRef.value?.clearSelection()
}

const saveFn = async () => {
  skuParams.value.skuAttrValueList = attrList.value?.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])

  skuParams.value.skuSaleAttrValueList = saleAttrList.value?.reduce((prev: any, next: any) => {
    if (next.saleAttrIdAndValueId) {
      const [saleAttrId, saleAttrValueId] = next.saleAttrIdAndValueId.split(':')
      prev.push({ saleAttrId, saleAttrValueId })
    }
    return prev
  }, [])

  await reqAddSkuServer(skuParams.value as SkuData)
  ElMessage.success(skuParams.value.id ? '修改SKU成功' : '新增SKU成功')
  $emit('close')
}

defineExpose({
  open
})

const $emit = defineEmits(['close'])
const cancel = () => {
  $emit('close')
}
defineOptions({
  name: 'SkuForm'
})
</script>

<template>
  <el-form :rules="sukFormRules" :model="skuParams" class="sku-form-container" label-width="100px">
    <el-form-item prop="skuName" style="width: 40%" label="SKU名称">
      <el-input v-model="skuParams.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item prop="price" style="width: 28%" label="价格(元)">
      <el-input v-model="skuParams.price" placeholder="价格(元)" type="number"></el-input>
    </el-form-item>
    <el-form-item style="width: 28%" label="重量(g)">
      <el-input v-model="skuParams.weight" placeholder="重量(g)" type="number"></el-input>
    </el-form-item>
    <el-form-item prop="skuDesc" label="SKU描述">
      <el-input v-model="skuParams.skuDesc" placeholder="SKU描述" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="平台属性" v-if="attrList?.length">
      <el-form style="width: 100%" :inline="true">
        <el-form-item
          style="width: 28%; margin-bottom: 10px"
          v-for="item in attrList"
          :key="item.id"
          :label="item.attrName"
          size="default"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :key="attrValue.id"
              v-for="attrValue in item.attrValueList"
              :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性" v-if="saleAttrList?.length">
      <el-form style="width: 100%" :inline="true">
        <el-form-item
          v-for="item in saleAttrList"
          :key="item.id"
          style="width: 28%; margin-bottom: 10px"
          :label="item.saleAttrName"
          size="default"
        >
          <el-select v-model="item.saleAttrIdAndValueId">
            <el-option
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${item.id}:${saleAttrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item style="width: 70%" label="图片名称" size="default">
      <el-table
        @select-all="handleSelectAll"
        @select="handleImgSelect"
        :data="imageList"
        border
        ref="imgFormRef"
      >
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row }">
            <img style="width: 100px; height: 100px" :src="row.imgUrl" :alt="row.imgName" />
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template #default="{ row }">
            {{ row.imgName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button @click="setDefaultFn(row)" type="warning" size="default">设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button @click="saveFn" type="primary" size="default">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
