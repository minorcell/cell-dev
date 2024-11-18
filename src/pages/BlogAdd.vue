<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { uploadServer } from '../api/file'
import { ElMessage } from 'element-plus'
import { uploadBlog, getTypesServer, getBlogDetailServer, updateBlogServer } from '../api/blog'
import { handleTime } from '../utils/tools'

const editorRef = shallowRef()
const router = useRoute()
const blogInfo = ref({
    title: "",
    type: "",
    intro: "",
    cover: "",
    content: "",
    status: "editing",
    update_time: "",
})
const drawer = ref(false)
const blogTypes = ref([])
const modol = ref("add")
const blogId = ref(router.query.id);

const toolbarConfig = {
    excludeKeys: [
        "group-video",
        "fullScreen",
        "insertTable",
        "todo"
    ]
}

const editorConfig = {
    placeholder: '请在此输入内容...',
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

async function getBlogDetail(id) {
    try {
        const res = await getBlogDetailServer(id);
        const { title, type, intro, cover, content, update_time } = res.data.data
        blogInfo.value = { title, type, intro, cover, content, update_time }
    } catch {
        ElMessage({
            message: '获取博客详情失败！'
        })
    }
}

onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

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

const updateBlog = async () => {

    const { title, type, intro, cover, content } = blogInfo.value;
    if (!title || !type || !intro || !cover || !content) {
        ElMessage({
            message: '请填写完整信息后再更新！'
        });
        return;
    }
    try {
        await updateBlogServer({ id: blogId.value, title, type, intro, cover, content });
        ElMessage({
            message: '更新成功！'
        });
        drawer.value = false;
        getBlogDetail(blogId.value);
    } catch {
        ElMessage({
            message: '更新失败，请稍后再试！'
        });
    }
}

const sendToBlog = async () => {
    const { title, type, intro, cover, content } = blogInfo.value;
    if (!title || !type || !intro || !cover || !content) {
        ElMessage({
            message: '请填写完整信息后再发布！'
        });
        return;
    }
    try {
        await uploadBlog({ title, type, intro, cover, content });
        ElMessage({
            message: '发布成功！',
        });
        drawer.value = false;
    } catch {
        ElMessage({
            message: '发布失败，请稍后再试！'
        });
    }
};

const handleCreated = (editor) => {
    editorRef.value = editor
}

const handleDrawerClose = () => {
    drawer.value = false
}

const handleKeydown = (event) => {
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        if (modol != "add") {
            updateBlog();
        }
    }
}

onMounted(() => {
    if (router.query.id) {
        getBlogDetail(router.query.id)
        modol.value = "update"
        blogId.value = router.query.id;
    }
    document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleKeydown);
});

</script>

<template>
    <div class="h-full w-full flex flex-col items-center overflow-y-auto">
        <div class="z-10 w-full flex flex-col items-center justify-center sticky top-0">
            <div class="w-full flex items-center justify-evenly px-4 bg-white border-b border-gray-200">
                <el-button text v-if="modol !== 'add'">更新于：{{ handleTime(blogInfo.update_time) }}</el-button>
                <span v-if="modol !== 'add'" class="block h-full w-[1px] bg-gray-200" />
                <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
                <span class="block h-full w-[1px] bg-gray-200" />
                <el-button @click="drawer = true" text bg>{{ modol === 'add' ? "发布" : "更新" }}</el-button>
            </div>
            <div class="w-full h-[1px] bg-gray-200"></div>
        </div>
        <div class="w-3/5 h-[85vh] mt-8 flex items-center justify-center">
            <Editor class="w-full min-h-[80vh] pb-[6vh]" v-model="blogInfo.content" :defaultConfig="editorConfig"
                mode="default" @onCreated="handleCreated" />
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
                            <el-option v-for="item in blogTypes" :key="item.type" :label="item.type" :value="item.type">
                                <span>{{ item.type }} —— (已有{{ item.count }}篇)</span>
                            </el-option>
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
                        <el-button text bg class="w-full" @click="sendToBlog" v-if="modol === 'add'">发布博客</el-button>
                        <el-button text bg class="w-full" @click="updateBlog" v-else>更新博客</el-button>
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
