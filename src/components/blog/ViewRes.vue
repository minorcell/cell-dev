<script setup>
import { sleep } from '../../utils/tools';
import { uploadBlog, getTypesServer } from '../../api/blog';

const emit = defineEmits()
const blogTypes = ref([])

const props = defineProps({
    drawer: Boolean,
    blogInfo: Object
})

const handleClose = () => {
    emit('closeDrawer')
}

const getTypes = async () => {
    const res = await getTypesServer()
    blogTypes.value = res.data.data
}
getTypes()

const handleAvatarSuccess = (res) => {
    props.blogInfo.cover = res.full_url
}

const beforeAvatarUpload = (rawFile) => {
    if (!rawFile.type.startsWith('image/')) {
        ElMessage('必须是图片!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 1) {
        ElMessage('必须是小于1MB的图片!')
        return false
    }
    return true
}

const sendToBlog = async () => {
    const { title, type, intro, cover, content } = props.blogInfo;
    if (!title || !type || !intro || !cover || !content) {
        ElMessage("请填写完整信息后再发布！");
        return;
    }
    try {
        await uploadBlog({
            title,
            type,
            intro,
            cover,
            content,
        })
        ElMessage("发布成功！");
        handleClose()
    } catch {
        ElMessage("发布失败，请稍后再试！");
        return;
    }
}

</script>

<template>
    <el-drawer v-model="props.drawer" title="发布博客内容" size="50%" direction="rtl" @close="handleClose"
        class="bg-gray-50 text-gray-700 p-6">
        <div class="w-full h-full flex flex-col items-center">
            <el-form label-width="120px" :model="props.blogInfo"
                class="bg-white rounded-lg p-8 h-full w-full space-y-12">
                <el-form-item label="标题">
                    <el-input type="text" class="w-full p-2 focus:outline-none rounded border-gray-100"
                        v-model="props.blogInfo.title" placeholder="请输入文章标题" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-select name="type" id="" class="w-full p-2 rounded-md border-none focus:outline-none" clearable
                        v-model="props.blogInfo.type">
                        <el-option v-for="item in blogTypes" :key="item" :label="item" :value="item" />
                        <template #footer>
                            <el-input v-model="props.blogInfo.type" placeholder="请输入新的文章类型" />
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input type="textarea" autosize v-model="props.blogInfo.intro" placeholder="请输入文章简介"
                        class="w-full focus:outline-none rounded-md p-2" />
                </el-form-item>
                <el-form-item label="封面">
                    <el-upload class="w-48 h-48 flex rounded-md mx-2" drag="true"
                        action="http://127.0.0.1:5000/api/file/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="props.blogInfo.cover" :src="props.blogInfo.cover" class="w-48 h-32 object-cover" />
                        <span class="icon-[material-symbols--upload] w-48" v-else></span>
                    </el-upload>
                </el-form-item>
                <el-form-item class="flex justify-center">
                    <el-button text bg class="w-full" @click="sendToBlog">发布至博客</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
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
    text-align: center;
}
</style>