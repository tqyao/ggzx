<script setup lang="ts">
import { useLayOutSettingStore } from '@/store'
import { nextTick, watch, ref } from 'vue'

// 监听刷新按钮点击事件变化，执行创建销毁组件
const layOutSettingStore = useLayOutSettingStore()
const flag = ref(false)
watch(
  () => layOutSettingStore.refresh,
  () => {
    /*
     首先layOutSettingStore.refresh = false 销毁组件
     接着通过 nextTick 等待组件销毁完成 DOM 元素更新完后，再将 layOutSettingStore.refresh = true 重新渲染组件
     */
    flag.value = true
    nextTick(() => {
      flag.value = false
    })
  }
)
</script>
<template>
  <!-- 配置路由切换动画过度效果  -->
  <!-- 路由组件出口的位置 -->
  <router-view v-if="!flag" v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由的子路由 -->
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
}
</style>
