<template>
    <el-menu :collapse="isCloseable" default-active="1" class="w-48 h-full select-none custom-menu">
        <h5 class="p-4 flex justify-center items-center text-2xl font-bold">CELL DEV</h5>
        <el-menu-item index="1" @click="navigateTo('/')">
            <el-icon><span class="icon-[ri--dashboard-2-line]"></span></el-icon>
            <span class="ml-2">分析面板</span>
        </el-menu-item>
        <el-sub-menu index="2">
            <template #title>
                <el-icon><span class="icon-[stash--article-alt-duotone]"></span></el-icon>
                <span class="ml-2">博客</span>
            </template>
            <el-menu-item index="2-1" @click="navigateTo('/blogcate')">
                <el-icon><span class="icon-[material-symbols--list]"></span></el-icon>
                <span class="ml-2">文章管理</span>
            </el-menu-item>
            <el-menu-item index="2-2" @click="navigateTo('/blogedit')">
                <el-icon><span class="icon-[ri--article-line]"></span></el-icon>
                <span class="ml-2">编辑台</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
            <template #title>
                <el-icon><span class="icon-[pajamas--project]"></span></el-icon>
                <span class="ml-2">作品</span>
            </template>
            <el-menu-item index="3-1" @click="navigateTo('/workcate')">
                <el-icon><span class="icon-[material-symbols--table]"></span></el-icon>
                <span class="ml-2">作品管理</span>
            </el-menu-item>
            <el-menu-item index="3-2" @click="navigateTo('/workadd')">
                <el-icon><span class="icon-[material-symbols--upload-file-outline-rounded]"></span></el-icon>
                <span class="ml-2">添加作品</span>
            </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="4" @click="navigateTo('/usercate')">
            <el-icon><span class="icon-[solar--user-outline]"></span></el-icon>
            <span class="ml-2">用户管理</span>
        </el-menu-item>
        <el-menu-item index="5" @click="navigateTo('/botcate')">
            <el-icon><span class="icon-[ri--robot-2-line]"></span></el-icon>
            <span class="ml-2">Bot管理</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    isCloseable: Boolean
});

const navigateTo = (path) => {
    router.push(path);
};
</script>

<style scoped>
.custom-menu {
    --el-menu-active-color: black;
    --el-menu-text-color: rgb(107 114 128);
}
</style>
