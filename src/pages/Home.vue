<script setup>
import { ref } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import VueECharts from 'vue-echarts';
import { getDashBoardServer } from '../api/home';

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);

defineExpose({ VueECharts });

const recentBlog = ref([]);
const recentWork = ref([]);
const recentInfo = ref([]);


const getDashBoardData = async () => {
    const res = await getDashBoardServer();

    recentBlog.value = res.data.data.recent_blog;
    recentWork.value = res.data.data.recent_work;
    recentInfo.value = res.data.data.recent_info;
}
getDashBoardData();


const blogTypeChartOptions = ref({
    tooltip: {
        trigger: 'item',
    },
    legend: {
        bottom: '0%',
    },
    series: [
        {
            name: '博客类型',
            type: 'pie',
            radius: '50%',
            data: [
                { value: 1, name: '性能优化' },
                { value: 2, name: 'Vue' },
                { value: 2, name: '杂谈' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
});
</script>

<template>
    <div class="p-6 h-[89vh] overflow-y-auto">
        <el-card class="mb-6">
            <h2 class="text-lg font-semibold mb-4">博客类型统计</h2>
            <VueECharts :options="blogTypeChartOptions" class="w-full h-96"></VueECharts>
        </el-card>

        <div class="grid grid-cols-2 gap-6">
            <el-card>
                <h2 class="text-lg font-semibold mb-4">最近博客</h2>
                <el-row :gutter="20">
                    <el-col :span="6" v-for="blog in recentBlog" :key="blog.id">
                        <el-card shadow="hover">
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
                        <el-card shadow="hover">
                            <a :href="work.link" target="_blank" class="text-global font-semibold">{{ work.name }}</a>
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
