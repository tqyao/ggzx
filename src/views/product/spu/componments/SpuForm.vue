<script setup lang="ts">
import { computed, nextTick, onMounted, ref, reactive } from 'vue'
import type { HasSaleAttr, SaleAttr, SpuData, SpuImg } from '@/api/product/spu/type'
import {
  reqAddOrUpdateSpuServer,
  reqAllSaleAttrServer,
  reqAllTradeMarkServer,
  reqSpuHasSaleAttrServer,
  reqSpuImageListServer
} from '@/api/product/spu'
import type { TradeMark } from '@/api/product/trademark/type'
import {
  type UploadRawFile,
  type UploadFile,
  type UploadUserFile,
  type ElForm,
  ElInput,
  type FormRules
} from 'element-plus'

const spuParams = ref<SpuData>({
  spuName: '',
  description: '',
  category3Id: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: []
})

const spuFormRules = reactive<FormRules<typeof spuParams.value>>({
  spuName: [{ required: true, message: '请输入SPU名称', trigger: 'blur' }],
  tmId: [{ required: true, message: '请选择SPU品牌', trigger: 'change' }],
  description: [
    { required: true, message: '请输入SPU描述', trigger: 'blur' },
    { min: 5, message: '描述不少于 5 个字符', trigger: 'blur' }
  ]
})

// const spuFormRules = {
//   spuName: [{ required: true, message: '请输入SPU名称', trigger: 'blur' }],
//   tmId: [{ required: true, message: '请选择SPU品牌', trigger: 'change' }],
//   description: [
//     { required: true, message: '请输入SPU描述', trigger: 'blur' },
//     { min: 5, message: '描述不少于 5 个字符', trigger: 'blur' }
//   ]
// }

const allTradeMark = ref<TradeMark[]>([])
const getTradeMarkList = async () => {
  const resp = await reqAllTradeMarkServer()
  allTradeMark.value = resp.data
}

onMounted(() => {
  getTradeMarkList()
  getAllSaleAttrList()
})

const imgList = ref<UploadUserFile[] | SpuImg[]>([])
//点击文件列表中已上传的文件时的钩子
const handlePictureCardPreview = (uploadFile: UploadFile) => {
  dialogImageUrl.value = uploadFile.url || ''
  dialogVisible.value = true
}
// 文件列表移除文件时的钩子
// 上传文件之前的钩子，参数为上传的文件，
// 若返回 false 或者返回 Promise 且被 reject，则停止上传。
const handlerUpload = (file: UploadRawFile) => {
  console.log(file)
  const fileType = file.type
  if (fileType !== 'image/jpeg' && fileType !== 'image/png' && fileType !== 'image/jpg') {
    ElMessage.error('请上传正确的图片格式（jpeg、jpg、png）')
    return false
  }
  if (file.size / 1024 / 1024 > 3) {
    ElMessage.error('请上传小于3M的图片')
    return false
  }

  return true
}

const dialogVisible = ref(false)
const dialogImageUrl = ref('')

const attrValueInpRef = ref<InstanceType<typeof ElInput>>()
// 点击编辑销售属性值 tag 标签
const toEdit = (row: SaleAttr) => {
  row.flag = true
  nextTick(() => {
    attrValueInpRef.value?.focus()
  })
}

// 添加销售属性值 input 失去焦点后触发回调
const toLook = (row: SaleAttr) => {
  row.flag = false
  const { baseSaleAttrId, saleAttrValue } = row

  if (!saleAttrValue?.trim()) {
    return
  }
  const newAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string
  }
  // 判断属性值是否重复
  const repeat = row.spuSaleAttrValueList.some(
    (item) => item.saleAttrValueName === newAttrValue.saleAttrValueName
  )
  if (repeat) {
    ElMessage.error('属性值重复')
    row.saleAttrValue = ''
    return
  }

  row.spuSaleAttrValueList.push(newAttrValue)
  row.saleAttrValue = ''
}

// 删除销售属性和其所包含值
const delAttrFn = (index: number) => {
  hasSaleAttrList.value.splice(index, 1)
}

// 获取 spu 相册
const getSpuImagesList = async () => {
  const resp = await reqSpuImageListServer(spuParams.value.id as number)
  imgList.value = resp.data.map((item) => ({
    name: item.imgName,
    url: item.imgUrl
  }))
}

// 可选的销售属性列表（全部销售属性-已有销售属性）
const enableSelectAttrList = computed<HasSaleAttr[]>(() => {
  return allSaleAttrList.value.filter((attr1) =>
    hasSaleAttrList.value.every((attr2) => {
      return attr1.id != attr2.baseSaleAttrId
    })
  )
})

// 获取所有销售属性列表
const allSaleAttrList = ref<HasSaleAttr[]>([])
const getAllSaleAttrList = async () => {
  const resp = await reqAllSaleAttrServer()
  allSaleAttrList.value = resp.data
}

const hasSaleAttrList = ref<SaleAttr[]>([])
// 获取 spu 已有销售属性列表
const getHasSaleAttrList = async () => {
  const resp = await reqSpuHasSaleAttrServer(spuParams.value.id as number)
  hasSaleAttrList.value = resp.data
}

// select 选中的销售属性 id 和 属性值
const saleAttrIdAndValueName = ref('')
// 点击添加属性值按钮回调
const addAttrNameToArr = () => {
  // 获取销售属性 id 和 属性值名字
  const [id, name] = saleAttrIdAndValueName.value.split(':')
  const newAttr: SaleAttr = {
    baseSaleAttrId: id,
    saleAttrName: name,
    spuSaleAttrValueList: []
  }
  hasSaleAttrList.value.push(newAttr)
  saleAttrIdAndValueName.value = ''
}

const spuFormRef = ref<InstanceType<typeof ElForm> | null>(null)
const open = (row: SpuData) => {
  resetForm()
  spuParams.value = {
    ...row
  }
  if (row.id) {
    // * open 方法是声明在 setup 中的，通过父组件调用，执行时机早于 mounted
    // 编辑 spu
    getSpuImagesList()
    getHasSaleAttrList()
  }
}

const $emit = defineEmits(['close'])

const resetForm = () => {
  spuFormRef.value?.resetFields()
  saleAttrIdAndValueName.value = ''
  hasSaleAttrList.value = []
  imgList.value = []
}

const save = async () => {
  // 转换成接口所需要的数据字段
  spuParams.value.spuImageList = imgList.value.map((item) => {
    return {
      imgName: item.name,
      imgUrl: item.url
    }
  })
  spuParams.value.spuSaleAttrList = hasSaleAttrList.value
  await spuFormRef.value?.validate()
  await reqAddOrUpdateSpuServer(spuParams.value)
  ElMessage.success(spuParams.value.id ? '修改SPU成功' : '添加SPU成功')
  resetForm()
  $emit('close', 'reflush')
}
const cancel = () => {
  resetForm()
  $emit('close')
}

defineExpose({
  open
})
defineOptions({
  name: 'SpuForm'
})
</script>

<template>
  <el-form
    :model="spuParams"
    :rules="spuFormRules"
    ref="spuFormRef"
    class="spu-form"
    label-width="100px"
  >
    <el-form-item prop="spuName" label="SPU名称">
      <el-input
        style="width: 25%"
        placeholder="请你输入SPU名称"
        v-model="spuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item prop="tmId" label="SPU品牌">
      <el-select style="width: 25%" v-model="spuParams.tmId">
        <el-option
          v-for="item in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="description" label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        v-model="spuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- v-model:fileList->展示默认图片
           action:上传图片的接口地址
           list-type:文件列表的类型
      -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        :disable="!saleAttrIdAndValueName"
        style="width: 25%"
        v-model="saleAttrIdAndValueName"
        :placeholder="
          enableSelectAttrList.length
            ? `还有${enableSelectAttrList.length}属性可选`
            : '暂无销售属性'
        "
      >
        <el-option
          v-for="item in enableSelectAttrList"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        :disabled="!saleAttrIdAndValueName"
        @click="addAttrNameToArr"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        >添加属性
      </el-button>
      <!-- table展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0" :data="hasSaleAttrList">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row:即为当前SPU已有的销售属性对象 -->
          <template #default="{ row }">
            <el-tag
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="item.id"
              style="margin: 0px 5px"
              class="mx-1"
              closable
              >{{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              @keydown.enter="toLook(row)"
              ref="attrValueInpRef"
              v-model.trim="row.saleAttrValue"
              v-if="row.flag"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button size="small" v-else class="mx-1" @click="toEdit(row)"> + 新标签</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120px">
          <template #default="{ row, $index }">
            <el-button
              @click="delAttrFn($index)"
              type="danger"
              size="small"
              icon="Delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
