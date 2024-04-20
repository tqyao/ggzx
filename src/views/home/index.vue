<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
onMounted(async () => {
  await userStore.reqUserInfo().catch((error) => {
    ElNotification({
      title: '错误',
      message: error.message,
      type: 'error'
    })
  })
})
defineOptions({
  name: 'HomeIndex'
})
</script>

<template>
  <div>home</div>
</template>

<style scoped lang="=scss"></style>
