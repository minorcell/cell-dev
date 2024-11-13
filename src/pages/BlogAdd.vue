<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, h } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import ViewRes from "../components/blog/ViewRes.vue"

import { uploadServer } from '../api/file';

import { ElNotification } from 'element-plus'

const editorRef = shallowRef()
const valueHtml = ref('')
const drawer = ref(false)

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
            async customUpload(file, inserFn) {
                console.log(file);

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
                    inserFn(res.data.full_url, res.data.part_url, res.data.part_url)
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
    ElNotification({
        title: 'Title',
        message: h('i', { style: 'color: teal' }, 'This is a reminder'),
        type: 'success',
        position: "top-left"
    })
}

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
                <el-tooltip effect="dark" content="发布到前台博客，点击开打更多操作。" placement="bottom">
                    <el-button @click="drawer = true">发布</el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="暂时保存为草稿，方便接续编辑。" placement="bottom">
                    <el-button @click="savaAsDraft">存稿</el-button>
                </el-tooltip>
            </div>
            <div class="w-full h-[1px] bg-gray-200"></div>
        </div>
        <div class="w-3/5 h-[80vh] mt-12">
            <input type="text" placeholder="请输入标题..."
                class="border-none py-5 px-2 w-full text-3xl focus:outline-none outline-none" autofocus>
            <Editor class="min-h-[75vh] pb-8" v-model="valueHtml" :defaultConfig="editorConfig" mode="default"
                @onCreated="handleCreated" />
        </div>
        <ViewRes :drawer="drawer" :htmlString="valueHtml" @closeDrawer="handleDrawerClose" />
    </div>
</template>
