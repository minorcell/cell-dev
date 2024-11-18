<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn'

</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>
