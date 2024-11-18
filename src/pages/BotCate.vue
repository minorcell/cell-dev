<script setup>
import { ref } from 'vue';
import {
    getBotServer,
    updateBotServer
} from "../api/bot";
import { handleTime } from '../utils/tools';

const bot = ref({
    id: "",
    intro: '',
    api_key: '',
    bot_id: '',
    update_time: "",
})

const changeBotInfo = ref({
    intro: '',
    api_key: '',
    bot_id: ''
})

const getBot = async () => {
    try {
        const res = await getBotServer()
        bot.value = res.data.data[0];

    } catch {
        ElMessage({
            message: '获取BOT信息失败！'
        })
    }
}
getBot()

const handleSave = async () => {
    try {
        await updateBotServer({
            id: bot.value.id,
            ...changeBotInfo.value
        })
        ElMessage({
            message: '修改BOT信息成功！'
        })
    } catch {
        ElMessage({
            message: '修改BOT信息失败！'
        })
    } finally {
        getBot()
    }
}

const hiddenApiKey = (value) => {
    const length = value.length;
    if (length <= 4) return '*'.repeat(length);
    return value.slice(0, 2) + '*'.repeat(length - 4) + value.slice(-2);
}
</script>

<template>
    <div class="w-[50%] h-full p-6">
        <el-descriptions title="BOT 信息" column="1">
            <el-descriptions-item label="ID">{{ bot.id }}</el-descriptions-item>
            <el-descriptions-item label="简介">{{ bot.intro }}</el-descriptions-item>
            <el-descriptions-item label="API_KEY">{{ hiddenApiKey(bot.api_key) }}</el-descriptions-item>
            <el-descriptions-item label="BOT_ID">
                {{ bot.bot_id }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ handleTime(bot.update_time) }}</el-descriptions-item>
        </el-descriptions>
        <el-divider>修改BOT配置</el-divider>
        <el-form :model="changeBotInfo" label-width="auto">
            <el-form-item label="简介">
                <el-input v-model="changeBotInfo.intro" :placeholder="bot.intro" />
            </el-form-item>
            <el-tooltip placement="top" content="API_KEY是用于调用BOT的密钥，请勿泄露给他人！且谨慎修改！">
                <el-form-item label="API_KEY">
                    <el-input v-model="changeBotInfo.api_key" :placeholder="hiddenApiKey(bot.api_key)" type="password"
                        show-password />
                </el-form-item>
            </el-tooltip>
            <el-form-item label="BOT_ID">
                <el-input v-model="changeBotInfo.bot_id" :placeholder="bot.bot_id" />
            </el-form-item>
            <el-form-item>
                <el-button @click="handleSave">保存修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped lang="scss"></style>