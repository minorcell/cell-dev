<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { uploadServer } from '../api/file'
import { ElMessage } from 'element-plus'
import { uploadBlog, getTypesServer } from '../api/blog'

const editorRef = shallowRef()
const blogInfo = ref({
    title: "",
    type: "",
    intro: "",
    cover: "",
    content: ""
})
const drawer = ref(false)
const blogTypes = ref([])

const toolbarConfig = {
    excludeKeys: [
        "group-video",
        "fullScreen",
        "insertTable",
        "todo"
    ]
}

const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        "uploadImage": {
            maxNumberOfFiles: 1,
            async customUpload(file, insertFn) {
                if (!file.type.includes("image")) {
                    ElMessage({
                        message: '请上传图片格式文件！',
                        type: 'warning',
                    })
                }
                if (file.size / 1024 / 1024 > 2) {
                    ElMessage({
                        message: '请上传小于2MB的图片！',
                        type: 'warning',
                    })
                }
                const formData = new FormData();
                formData.append("file", file);
                try {
                    const res = await uploadServer(formData);
                    ElMessage({
                        message: '上传成功！',
                        type: 'success',
                    })
                    insertFn(res.data.full_url, res.data.part_url, res.data.part_url)
                } catch {
                    ElMessage({
                        message: '上传失败！',
                        type: 'error',
                    })
                }
            }
        }
    }
}

onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const savaAsDraft = () => {
    if (blogInfo.value.title == "") {
        ElMessage({
            message: "请输入标题之后再暂存！",
            type: 'warning',
        });
        return;
    }
    ElMessage({
        message: "暂存成功！",
        type: 'success',
    });
}

const getTypes = async () => {
    const res = await getTypesServer();
    blogTypes.value = res.data.data;
};
getTypes();

const handleAvatarSuccess = (res) => {
    blogInfo.value.cover = res.full_url;
};

const beforeAvatarUpload = (rawFile) => {
    if (!rawFile.type.startsWith('image/')) {
        ElMessage({
            message: '必须是图片!',
            type: 'error',
        });
        return false;
    } else if (rawFile.size / 1024 / 1024 > 1) {
        ElMessage({
            message: '必须是小于1MB的图片!',
            type: 'error',
        });
        return false;
    }
    return true;
};

const sendToBlog = async () => {
    const { title, type, intro, cover, content } = blogInfo.value;
    if (!title || !type || !intro || !cover || !content) {
        ElMessage({
            message: '请填写完整信息后再发布！',
            type: 'warning',
        });
        return;
    }
    try {
        await uploadBlog({ title, type, intro, cover, content });
        ElMessage({
            message: '发布成功！',
            type: 'success',
        });
        blogInfo.value = { title: '', type: '', intro: '', cover: '', content: '' };
        drawer.value = false;
    } catch {
        ElMessage({
            message: '发布失败，请稍后再试！',
            type: 'error',
        });
    }
};

const handleCreated = (editor) => {
    editorRef.value = editor
}

const handleDrawerClose = () => {
    drawer.value = false
}

</script>

<template>
    <div class="h-full w-full flex flex-col items-center overflow-y-auto">
        <div class="z-10 w-full flex flex-col items-center justify-center sticky top-0">
            <div class="w-full flex items-center justify-center px-4 bg-white border-b border-gray-200">
                <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
                <span class="block h-full w-[1px] bg-gray-200 mr-4" />
                <el-button @click="drawer = true" text bg>发布</el-button>
                <el-button @click="savaAsDraft" text bg>存稿</el-button>
            </div>
            <div class="w-full h-[1px] bg-gray-200"></div>
        </div>
        <div class="w-3/5 h-[80vh] mt-12">
            <input type="text" placeholder="请输入标题..." v-model="blogInfo.title"
                class="border-none py-5 px-2 w-full text-3xl focus:outline-none outline-none" autofocus>
            <Editor class="min-h-[75vh] pb-8" v-model="blogInfo.content" :defaultConfig="editorConfig" mode="default"
                @onCreated="handleCreated" />
        </div>
        <el-drawer v-model="drawer" title="发布博客内容" size="50%" direction="rtl" @close="handleDrawerClose"
            class="bg-gray-50 text-gray-700 p-6">
            <div class="w-full h-full flex flex-col items-center">
                <el-form label-width="120px" :model="blogInfo" class="bg-white rounded-lg p-8 h-full w-full space-y-12">
                    <el-form-item label="标题">
                        <el-input type="text" class="w-full p-2 focus:outline-none rounded border-gray-100"
                            v-model="blogInfo.title" placeholder="请输入文章标题" />
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select name="type" class="w-full p-2 rounded-md border-none focus:outline-none" clearable
                            v-model="blogInfo.type">
                            <el-option v-for="item in blogTypes" :key="item" :label="item" :value="item" />
                            <template #footer>
                                <el-input v-model="blogInfo.type" placeholder="请输入新的文章类型" />
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="简介">
                        <el-input type="textarea" autosize v-model="blogInfo.intro" placeholder="请输入文章简介"
                            class="w-full focus:outline-none rounded-md p-2" />
                    </el-form-item>
                    <el-form-item label="封面">
                        <el-upload class="w-48 h-48 flex rounded-md mx-2" drag="true"
                            action="http://127.0.0.1:5000/api/file/upload" :show-file-list="false"
                            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="blogInfo.cover" :src="blogInfo.cover" class="w-48 h-32 object-cover" />
                            <span class="icon-[material-symbols--upload] w-48" v-else></span>
                        </el-upload>
                    </el-form-item>
                    <el-form-item class="flex justify-center">
                        <el-button text bg class="w-full" @click="sendToBlog">发布至博客</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>
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
    text-align: center;
}
</style>
