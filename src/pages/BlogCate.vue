<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';

import {
    getBlogsServer,
    changeBlogStatusServer,
    deleteBlogServer
} from '../api/blog'

import { handleTime } from "../utils/tools"

const tableData = ref([])
const isloading = ref(false)
const SearchParams = ref({
    page: 1,
    size: 10,
    type: "",
    status: "",
})
const total = ref(0)
const router = useRouter()

async function getBlogs() {
    isloading.value = true
    try {
        const res = await getBlogsServer(SearchParams.value)
        res.data.data.forEach(item => {
            item.isPublished = item.status === "published"
        })
        tableData.value = res.data.data
        total.value = res.data.total
    } catch {
        ElMessage({
            message: '获取失败！',
            icon: "none"
        })
    } finally {
        isloading.value = false
    }
}

const handleSwitch = async (value, id) => {
    isloading.value = true
    try {
        await changeBlogStatusServer({ id, status: value ? "published" : "editing" })
        ElMessage({
            message: '状态修改成功！',
            icon: "none"
        })
        getBlogs()
    } catch {
        ElMessage({
            message: '状态修改失败！',
            icon: "none"
        })
    } finally {
        isloading.value = false
    }
}

const handlePageChange = (value) => {
    SearchParams.value.page = value
    getBlogs()
}

const toEdit = (id) => {
    router.push(`/blogedit?id=${id}`);
}

const handleDelete = async (id) => {
    isloading.value = true
    try {
        await deleteBlogServer(id)
        ElMessage({
            message: '删除成功！',
        })
        getBlogs()
    } catch {
        ElMessage({
            message: '删除失败！',
        })
    } finally {
        isloading.value = false
    }
}

onMounted(() => {
    getBlogs()
})

const intro = (value) => {
    value.length > 50 && (value = value.slice(0, 50) + '...')
    return value
}
</script>

<template>
    <keep-alive>
        <div class="h-full w-[90vw] flex flex-col items-center">
            <el-table :data="tableData" style="height: 92%; width: 100%; overflow-y: auto;" v-loading="isloading"
                table-layout="auto">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="type" label="类型">
                    <template #default="scope">
                        <el-tag effect="info">{{ scope.row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="intro" label="简介">
                    <template #default="scope">
                        <span>{{ intro(scope.row.intro) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="looks" label="浏览量" />
                <el-table-column prop="status" label="编辑中/已发布">
                    <template #default="scope">
                        <el-switch v-model="scope.row.isPublished" @change="handleSwitch($event, scope.row.id)"
                            style="--el-switch-on-color: #606266; --el-switch-off-color: lightgray" />
                    </template>
                </el-table-column>
                <el-table-column prop="update_time" label="更新时间">
                    <template #default="scope">
                        <span>{{ handleTime(scope.row.update_time) }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <el-button text bg size="small" @click="toEdit(scope.row.id)">
                            编辑
                        </el-button>
                        <el-popconfirm title="确定删除吗?" @confirm="handleDelete(scope.row.id)" hide-icon
                            cancel-button-type="info" confirm-button-type="info">
                            <template #reference><el-button text bg size="small">
                                    删除
                                </el-button></template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="mt-4" :total="total" layout="total, prev, pager" :page-size="SearchParams.size"
                @current-change="handlePageChange" />
        </div>
    </keep-alive>
</template>
