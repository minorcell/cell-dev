<template>
    <el-drawer v-model="props.drawer" title="发布博客内容" size="75%" direction="rtl" @close="handleClose">
        <div class="w-full h-full flex flex-col  text-3xl" v-html="htmlString" />
    </el-drawer>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    drawer: Boolean,
    htmlString: String
})

const emit = defineEmits()

const handleClose = () => {
    emit('closeDrawer')
}
</script>
