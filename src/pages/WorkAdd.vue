<script setup>
import { onMounted, ref } from 'vue';
import { createWorkServer, getWorkDetailServer, updateWorkServer } from "../api/work"
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { handleTime } from '../utils/tools';
const router = useRoute()
const workInfo = ref({
    name: '',
    intro: "",
    cover: "",
    link: "",
    vision: ""
})

const getWorkDetail = async (id) => {
    try {
        const res = await getWorkDetailServer(id)
        workInfo.value = res.data.data
    } catch {
        ElMessage({
            message: '获取作品详情失败！'
        })
    }
}

onMounted(() => {
    if (router.query.id) {
        getWorkDetail(router.query.id)
    }
})

const handleAvatarSuccess = (res) => {
    workInfo.value.cover = res.full_url;
};

const beforeAvatarUpload = (rawFile) => {
    if (!rawFile.type.startsWith('image/')) {
        ElMessage({
            message: '必须是图片!'
        });
        return false;
    } else if (rawFile.size / 1024 / 1024 > 1) {
        ElMessage({
            message: '必须是小于1MB的图片!'
        });
        return false;
    }
    return true;
};

const submitWork = async () => {
    try {
        await createWorkServer(workInfo.value)
        ElMessage({
            message: '创建作品成功！'
        })
    } catch {
        ElMessage({
            message: '创建作品失败！'
        })
    }
}

const updateWork = async () => {
    try {
        await updateWorkServer(workInfo.value)
        ElMessage({
            message: '更新作品成功！'
        })
        getWorkDetail(router.query.id)
    } catch {
        ElMessage({
            message: '更新作品失败！'
        })
    }
}

const rules = {
    name: [
        { required: true, message: '请输入作品名称', trigger: 'blur' },
        { min: 3, max: 50, message: '长度在 3 到 40 个字符', trigger: 'blur' }
    ],
    intro: [
        { required: true, message: '请输入作品简介', trigger: 'blur' },
        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
    ],
    cover: [
        { required: true, message: '请输入作品封面', trigger: 'blur' },
        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
    ],
    link: [
        { required: true, message: '请输入作品链接', trigger: 'blur' },
        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
    ]
}
</script>

<template>
    <div class="w-full h-full flex flex-col text-3xl">
        <el-form :model="workInfo" label-width="auto" class="w-[50%] p-6" :rules="rules" ref="form">
            <el-form-item label="作品名称" prop="name">
                <el-input v-model="workInfo.name" placeholder="请输入作品名称" />
            </el-form-item>
            <el-form-item label="作品简介" prop="intro">
                <el-input v-model="workInfo.intro" placeholder="请输入作品简介" />
            </el-form-item>
            <el-form-item label="作品封面" prop="cover">
                <el-upload class="w-48 h-48 flex rounded-md mx-2" drag="true"
                    action="http://127.0.0.1:5000/api/file/upload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="workInfo.cover" :src="workInfo.cover" class="w-48 h-28 object-cover" />
                    <span class="icon-[material-symbols--upload] w-48" v-else></span>
                </el-upload>
            </el-form-item>
            <el-form-item label="作品链接" prop="link">
                <el-input v-model="workInfo.link" placeholder="请输入作品链接" />
            </el-form-item>
            <el-form-item label="版本" prop="vision">
                <el-input v-model="workInfo.vision" placeholder="请输入作品版本" />
            </el-form-item>
            <el-form-item v-if="workInfo.update_time" label="更新时间" prop="update_time">
                <span class="text-global text-sm">{{ handleTime(workInfo.update_time) }}</span>
            </el-form-item>
            <el-form-item>
                <div class="flex justify-between w-full">
                    <el-button v-if="router.query.id" bg text @click="updateWork" class="w-1/2">更新</el-button>
                    <el-button v-else bg text @click="submitWork" class="w-1/2">提交</el-button>
                    <el-button bg text @click="workInfo = {}" class="w-1/2">清空</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
.option-input {
    width: 100%;
    margin-bottom: 8px;
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
}
</style>