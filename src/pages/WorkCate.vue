<script setup>
import { ref } from 'vue'
import { getWorksServer, deleteWorkServer } from "../api/work"
import { handleTime } from '../utils/tools';
import { useRouter } from 'vue-router';

const router = useRouter()
const works = ref([])
const pageInfo = ref({
    page: 1,
    size: 10,
})
const total = ref(0)
const getWorks = async () => {
    try {
        const res = await getWorksServer({
            ...pageInfo.value
        })
        works.value = res.data.data
        total.value = res.data.total
    } catch {
        ElMessage({
            message: '获取作品信息失败！'
        })
    }
}
getWorks()

const handleDelete = async (id) => {
    try {
        await deleteWorkServer(id)
        ElMessage({
            message: '删除成功！',
        })
        getWorks()
    } catch {
        ElMessage({
            message: '删除失败！',
        })
    }
}

const handlePageChange = (value) => {
    pageInfo.value.page = value
    getWorks()
}

const toEdit = (id) => {
    router.push(`/workadd?id=${id}`);
}
</script>

<template>
    <div class="h-full w-[90vw] flex flex-col items-center">
        <el-table :data="works" table-layout="auto" style="height: 92%; width: 100%; overflow-y: auto;">
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="name" label="作品名称" />
            <el-table-column prop="link" label="作品链接">
                <template #default="scope">
                    <a :href="scope.row.link" target="_blank" class="text-global">{{ scope.row.link }}</a>
                </template>
            </el-table-column>
            <el-table-column prop="vision" label="版本">
                <template #default="scope">
                    <el-tag type="info">
                        {{ scope.row.vision }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="intro" label="作品简介" />
            <el-table-column prop="update_time" label="更新时间">
                <template #default="scope">
                    {{ handleTime(scope.row.update_time) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
                <template #default="scope">
                    <el-button text bg @click="toEdit(scope.row.id)" class="bg-global">编辑</el-button>
                    <el-popconfirm title="确定删除吗?" @confirm="handleDelete(scope.row.id)" hide-icon
                        cancel-button-type="info" confirm-button-type="info">
                        <template #reference><el-button text bg size="small">
                                删除
                            </el-button></template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="mt-4" :total="total" layout="total, prev, pager" :page-size="pageInfo.size"
            @current-change="handlePageChange" />
    </div>
</template>