<template>
    <header class="w-full h-12 flex items-center select-none">
        <button @click="toggleSidebar"
            class="border-none bg-transparent ml-4 p-2 pl-0 flex items-center text-2xl text-gray-600">
            <span class="icon-[fluent-mdl2--close-pane]" v-if="isSidebarOpen"></span>
            <span class="icon-[fluent-mdl2--close-pane-mirrored]" v-else></span>
        </button>
        <el-breadcrumb :separator-icon="ArrowRight" class="ml-4">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index"
                :to="item.path ? { path: item.path } : null">
                {{ item.name }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </header>
</template>

<script setup>
import { defineProps, defineEmits, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';

const props = defineProps({
    isSidebarOpen: Boolean
});
const emit = defineEmits(['toggle-sidebar']);
const route = useRoute();
const breadcrumbItems = ref([]);

const toggleSidebar = () => {
    emit('toggle-sidebar');
};

const pathMap = {
    '/': '分析面板',
    '/blogcate': '文章管理',
    '/blogedit': '编辑台',
    '/workcate': '作品管理',
    '/workadd': '作品编辑',
    '/botcate': 'Bot管理',
    '/user': '用户中心',
};


watchEffect(() => {
    const paths = route.path.split('/').filter(path => path);
    breadcrumbItems.value = paths.map((path, index) => {
        const fullPath = '/' + paths.slice(0, index + 1).join('/');
        return {
            name: pathMap[fullPath] || path.charAt(0).toUpperCase() + path.slice(1),
            path: fullPath
        };
    });
    breadcrumbItems.value.unshift({ name: '工作台', path: '/' });
});

</script>
