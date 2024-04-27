<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import type { Attr, AttrValue, AttrValueList } from '@/api/type'
import { reqAddOrUpdateAttr } from '@/api/product/attr'

// 与父组件editVisible属性进行双向数据绑定。控制添加属性表单的显示与隐藏
const editVisible = defineModel<boolean>('editVisible', {
  default: false
})

// 添加属性表单的数据
const attrForm = ref<Attr>({
  attrName: '',
  categoryId: '',
  categoryLevel: 0,
  attrValueList: [] as AttrValueList
})

/**
 * 开始渲染编辑\新增属性页面结构，提供给父组调用
 * 新增：重置属性；编辑：将当前属性赋值给 attrForm.value
 * @param row
 */
const open = (row: Attr) => {
  attrForm.value = {
    ...row,
    attrValueList: row.attrValueList ? [...row.attrValueList] : []
  }
  editVisible.value = true

  nextTick(() => {
    // 第一次挂载本页面时，让属性名输入框聚焦
    attrNameInpRef.value.focus()
  })
}

// 计算是否有属性值输入框可用（显示）
const isValueInpEnabled = computed(() => {
  return attrForm.value.attrValueList.some((item: AttrValue) => item.flag)
})

// 计算是否有属性值（即属性值数组中是否有属性值对象）
const isAnyAttrValue = computed(() => {
  return attrForm.value.attrValueList.length > 0
})

// 储存点击添加属性按钮时，属性名输入框的 ref
const attrNameInpRef = ref<HTMLInputElement | null>(null)
watch(isAnyAttrValue, (val: boolean) => {
  // 如果不存在属性值，则属性名输入框聚焦
  val || attrNameInpRef?.value?.focus()
})
// 储存点击添加属性按钮时，属性值输入框的 ref
const attrValInpRef = ref<HTMLInputElement | null>(null)
// watchEffect 类似 computed，会监听依赖属性的变化
watchEffect(() => {
  // 如果存在属性值输入框，则获取焦点
  if (attrValInpRef?.value) {
    attrValInpRef.value.focus()
  }
})

// 点击添加属性值回调
const addAttrFn = () => {
  /*
  - 校验属性名，不存在新增输入框
  1、禁用属性名属性框
  2、如果没有可用的输入框，则操作 attrForm 中的 attrValueList 数组，让数组添加一个空的属性值对象
  ，并让其 flag=true 表示显示属性值输入框
   */

  // 校验属性名，为空则输入框为键入值，拒绝新增输入框
  if (!attrForm.value.attrName) {
    return
  }

  // 存在属性值输入框，则不添加新的输入框了
  if (isValueInpEnabled.value) {
    return
  }

  attrForm.value.attrValueList.push({
    valueName: '',
    flag: true
  })
  //  todo 看讲解，为什么这里聚焦会失效
  // nextTick(() => {
  //   // 获取焦点
  //   const inputRef = ref()
  //   inputRef.value.focus()
  // })
}

// 点击取消添加属性回调
const cancelFn = () => {
  attrForm.value.attrValueList = []
  attrForm.value.attrName = ''
}

// 删除属性值回调
const delAttrValFn = (index) => {
  // 删除属性值
  attrForm.value.attrValueList.splice(index, 1)
}

// 属性值输入框失去焦点回调
const handleBlur = (row: AttrValue, index: number) => {
  if (row.valueName) {
    // 检查是否属性值重复
    const findIndex = attrForm.value.attrValueList.findIndex(
      // (item: AttrValue, idx: number) => item.valueName === row.valueName && idx !== index
      (item: AttrValue) => (item === row ? false : item.valueName === row.valueName)
    )
    if (findIndex > -1) {
      ElMessage({
        type: 'error',
        message: '属性值不能重复'
      })
      // 删除当前属性值对象
      attrForm.value.attrValueList.splice(index, 1)
      return
    }
    // 失去焦点时，如果属性值输入框有值，则将 flag 设置为 false 表示隐藏属性值输入框，展示该值的文本
    row.flag = false
  } else {
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    // 否则，删除当前属性值对象
    attrForm.value.attrValueList.splice(index, 1)
  }
}

// 保存按钮禁用状态
const saveDisabled = computed(() => {
  /*
  禁用：
  - 少于 1 个属性值不存在
  - 不少于 1 个属性值存在，但其属性值输入框中没有值
  - 不少于 1 个属性值存在，其属性值输入框中有值，但输入框还未失去焦点
   */
  return (
    attrForm.value.attrValueList.length < 1 ||
    attrForm.value.attrValueList.some((item: AttrValue) => {
      return item.valueName === '' || item.flag
    })
  )
})

const $emit = defineEmits(['success'])
// 保存按钮回调
const saveFn = async () => {
  await reqAddOrUpdateAttr(attrForm.value)
  ElMessage.success(attrForm.value.id ? '修改成功' : '添加成功')
  editVisible.value = false
  $emit('success')
}

// 取消按钮回调
const closeFn = () => {
  editVisible.value = false
}
defineExpose({ open })
</script>

<template>
  <div v-if="editVisible">
    <!-- 展示添加属性与修改数据的结构 -->
    <el-form @submit.prevent :model="attrForm" :inline="true">
      <el-form-item label="属性名">
        <el-input
          ref="attrNameInpRef"
          @keydown.enter="addAttrFn"
          :disabled="Boolean(attrForm.id) || isAnyAttrValue"
          v-model.trim="attrForm.attrName"
          placeholder="请你输入属性名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button
      @click="addAttrFn"
      :disabled="!attrForm.attrName"
      type="primary"
      size="default"
      icon="Plus"
      >添加属性值
    </el-button>
    <el-button v-show="!attrForm.id" @click="cancelFn" size="default">取消</el-button>
    <el-table :data="attrForm.attrValueList" border style="margin: 10px 0px">
      <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
      <el-table-column label="属性值">
        <!-- row:即为当前属性值对象 -->
        <template #default="{ row, $index }">
          <el-input
            ref="attrValInpRef"
            v-if="row.flag"
            v-model.trim="row.valueName"
            @keydown.enter="$event.target.blur()"
            size="small"
            placeholder="请你输入属性值名称"
            @blur="handleBlur(row, $index)"
          ></el-input>
          <div @click="row.flag = true" v-else>{{ row.valueName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="属性值操作">
        <template #default="{ $index }">
          <el-button
            @click="delAttrValFn($index)"
            type="danger"
            size="small"
            icon="Delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="saveFn" :disabled="saveDisabled" type="primary" size="default"
      >保存
    </el-button>
    <el-button @click="closeFn" size="default">关闭</el-button>
  </div>
</template>

<style scoped lang="scss"></style>
