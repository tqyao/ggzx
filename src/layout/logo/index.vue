<script setup lang="ts">
import setting from '@/setting'

defineProps({
  titleVisible: {
    type: Boolean,
    default: true
  }
})

defineOptions({
  name: 'Logo'
})
</script>

<template>
  <div class="logo">
    <img :src="setting.logo" alt="" v-if="setting.logoHidden" />
    <p v-if="titleVisible">{{ setting.title }}</p>
  </div>
</template>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;

  img {
    width: 40px;
    height: 40px;
  }

  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}
</style>
