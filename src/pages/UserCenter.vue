<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '../store';
import { useRouter } from 'vue-router';
const userStore = useUserStore()
const router = useRouter()


const user = ref(userStore.userInfo)
const activeName = ref('1')

const handleLoginOut = () => {
    userStore.logout()
    router.push('/login')
}

</script>

<template>
    <div class="p-6 select-none h-[90vh] overflow-y-auto">
        <div class="flex items-center">
            <el-avatar :src="user.avatar" :size="75" shape="square" />
            <div class="ml-4 h-full flex flex-col justify-between">
                <h2 class="text-xl font-semibold text-gray-800">{{ user.name }}</h2>
                <p class="text-sm text-gray-600">角色: {{ user.role == "0" ? "普通用户" : "系统管理员" }}</p>
            </div>
        </div>

        <div class="mt-6">
            <el-divider>关于</el-divider>
            <p class="text-gray-700">简介：{{ user.intro }}</p>
        </div>

        <div class="mt-4">
            <el-divider>GitHub 信息</el-divider>
            <p>
                <span class="text-global">用户名: </span>
                <a :href="'https://github.com/' + user.github_name" class="text-global hover:underline" target="_blank">
                    {{ user.github_name }}
                </a>
            </p>
            <p>
                <span class="text-global">编程语言：</span>
                <el-tag v-for="item in user.languages" :key="item" class="mr-3" effect="plain" type="info">{{
                    item
                    }}</el-tag>
            </p>

            <el-collapse v-model="activeName" accordion>
                <el-collapse-item :name="index + 1" v-for="(item, index) in user.repos" :key="item.name">
                    <template #title>
                        <div class="flex items-center">
                            <el-tag class="mr-2" effect="plain" type="info">{{ index + 1 }}</el-tag>
                            <h3 class="text-global">{{ item.name }}</h3>
                        </div>
                    </template>
                    <p class="text-global flex flex-col">
                        <span>仓库描述: {{ item.desc }} </span>
                        <span>仓库地址: <a :href="item.url" class="text-global hover:underline" target="_blank">{{
                            item.url }}</a></span>
                    </p>
                </el-collapse-item>
            </el-collapse>
        </div>
        <el-divider border-style="dotted" content-position="right">以上数据来源于GitHub，如要修改请前往GitHub</el-divider>
        <div class="w-full h-14 flex items-center justify-end">
            <el-tooltip effect="dark" content="点击退出登录" placement="bottom-end">
                <el-button text bg @click="handleLoginOut">退出登录</el-button>
            </el-tooltip>
        </div>
    </div>
</template>