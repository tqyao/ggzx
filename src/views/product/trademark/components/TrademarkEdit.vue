<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { TradeMark } from '@/api/product/trademark/type'
import { type UploadProps } from 'element-plus'
import { reqAddOrUpdateTrademarkServer } from '@/api/product/trademark'

const dialogFormVisible = ref(false)

const trademarkParams = ref<TradeMark>({
  tmName: '',
  logoUrl: ''
})

//品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.length < 2 || value.length > 10) {
    callBack(new Error('品牌名称长度在2-10之间'))
  } else {
    callBack()
  }
}
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    return callBack()
  }
  callBack(new Error('请上传品牌LOGO'))
}
//表单校验规则对象
const rules = {
  tmName: [
    //required:这个字段务必校验,表单项前面出来五角星
    //trigger:代表触发校验规则时机[blur、change]
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }]
}

//上传文件之前的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 文件类型校验
  if (
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('上传LOGO只能是 png/jpeg/gif 格式!')
    return false
  }
  // 文件大小校验
  if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('上传LOGO大小不能超过 4MB!')
    return false
  }
  return true
}
//上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response: any) => {
  // 服务器返回的图片地址
  trademarkParams.value.logoUrl = response.data
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}

const emit = defineEmits(['success'])
// 点击确认回调，上传品牌数据
const confirm = async () => {
  await formRef.value.validate()
  // 发请求
  await reqAddOrUpdateTrademarkServer(trademarkParams.value)
  // 通知父组件重新获取品牌列表数据
  if (trademarkParams.value?.id) {
    ElMessage({
      type: 'success',
      message: '修改品牌成功'
    })
    emit('success', 'edit')
  } else {
    ElMessage({
      type: 'success',
      message: '新增品牌成功'
    })
    emit('success', 'add')
  }
  dialogFormVisible.value = false
}

const formRef = ref()
// 提供父组件调用
const open = (tradeMark: TradeMark) => {
  dialogFormVisible.value = true
  // 重置表单
  nextTick(() => {
    formRef.value.resetFields()
    if (tradeMark?.id) {
      // 表单回显
      trademarkParams.value = { ...tradeMark }
    }
  })
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
    <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- upload组件属性:action图片上传路径书写/api,代理服务器不发送这次post请求  -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽:footer -->
    <template #footer>
      <el-button type="primary" size="default" @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
