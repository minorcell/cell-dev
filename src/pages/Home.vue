<script setup>
import { ref, onMounted, watch } from 'vue';
import { getDashBoardServer } from '../api/home';
import { useRouter } from 'vue-router'
import * as echarts from "echarts";


const recentBlog = ref([]);
const recentWork = ref([]);
const recentInfo = ref([]);
const modulesCounts = ref()
const blogTypes = ref([])

const router = useRouter();

const getDashBoardData = async () => {
    const res = await getDashBoardServer();
    const { recent_blog, recent_info, recent_work, counts, blog_type } = res.data.data;

    recentBlog.value = recent_blog;
    recentWork.value = recent_work;
    recentInfo.value = recent_info;
    modulesCounts.value = counts;
    blogTypes.value = blog_type;

}
getDashBoardData();
</script>

<template>
    <div class="p-6 h-[89vh] overflow-y-auto">
        <div class="grid grid-cols-2 gap-6">
            <el-card>
                <h2 class="text-lg font-semibold mb-4">最近博客</h2>
                <el-row :gutter="20">
                    <el-col :span="6" v-for="blog in recentBlog" :key="blog.id">
                        <el-card shadow="hover" @click="router.push(`/blogedit?id=${blog.id}`)">
                            <h3 class="font-semibold text-base mb-1">{{ blog.title.slice(0, 15) }}...</h3>
                            <p class="text-gray-500 text-sm">状态: {{ blog.status === 'published' ? "已发布" : "编辑中" }}</p>
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>

            <el-card>
                <h2 class="text-lg font-semibold mb-4">最近作品</h2>
                <el-row :gutter="20">
                    <el-col :span="6" v-for="work in recentWork" :key="work.id">
                        <el-card shadow="hover" @click="router.push(`/workadd?id=${work.id}`)">
                            <a :href="work.link" target="_blank" class="text-global font-semibold mb-1">{{ work.name
                                }}</a>
                            <p class="text-gray-500 text-sm mt-1">版本: {{ work.vision }}</p>
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>

            <el-card>
                <h2 class="text-lg font-semibold mb-4">最新通知</h2>
                <el-row :gutter="20">
                    <el-col :span="24" v-for="info in recentInfo" :key="info.id">
                        <div class="p-3 border rounded mb-3">
                            <h3 class="font-semibold text-base mb-1">{{ info.title }}</h3>
                            <p class="text-gray-500 text-sm mb-1">{{ info.content }}</p>
                            <p class="text-gray-400 text-xs">更新时间: {{ new Date(info.update_time).toLocaleString() }}</p>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</template>
