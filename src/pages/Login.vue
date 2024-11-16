<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginServer } from "../api/user";
import { useUserStore } from "../store/modules/user"

const userStore = useUserStore();
const router = useRouter();

const activeTab = ref("login");

const loginForm = ref({
    username: "",
    password: "",
});
const registerForm = ref({
    username: "",
    password: "",
    confirmPassword: "",
});

const login = async () => {
    if (!loginForm.value.username || !loginForm.value.password) {
        return ElMessage({
            message: "请输入用户名和密码",
        });
    }
    try {
        const res = await loginServer(loginForm.value);
        userStore.login(res.data.data);
        ElMessage({
            message: "登录成功",
        });
        router.push("/");
    } catch {
        ElMessage({
            message: "登录失败",
        });
    }
};

const register = () => {
    if (!registerForm.value.username || !registerForm.value.password || !registerForm.value.confirmPassword) {
        return ElMessage({
            message: "请输入用户名和密码",
        });
    }
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        return ElMessage({
            message: "两次输入密码不一致",
        });
    }
};
</script>

<template>
    <div class="min-h-screen flex flex-col justify-center items-center bg-gray-200">
        <div class="text-center mb-6 text-3xl font-bold text-gray-700">
            <h1>CELL DEV & 细胞工作台</h1>
            <p>智能化AI工作台</p>
        </div>
        <div class="w-full max-w-md p-6 bg-white shadow-lg h-[33vh] flex flex-col">
            <div class="flex justify-between mb-4">
                <button class="w-1/2 px-4 py-2 border-none"
                    :class="{ 'bg-global text-white': activeTab === 'login', 'bg-gray-200': activeTab !== 'login' }"
                    @click="activeTab = 'login'">
                    登录
                </button>
                <button class="w-1/2 px-4 py-2 border-none"
                    :class="{ 'bg-global text-white': activeTab === 'register', 'bg-gray-200': activeTab !== 'register' }"
                    @click="activeTab = 'register'">
                    注册
                </button>
            </div>
            <div v-if="activeTab === 'login'" class="flex-1">
                <form class="flex h-full flex-col justify-between">
                    <div class="w-full">
                        <label for="username" class="block text-xl font-medium text-gray-700">用户名</label>
                        <input type="text" id="username"
                            class="w-full py-3 bg-transparent border-none focus:outline-none"
                            v-model="loginForm.username" placeholder="请输入用户名" />
                        <label for=" password" class="block text-xl font-medium text-gray-700">密码</label>
                        <input type="password" id="password"
                            class="w-full py-3 bg-transparent border-none focus:outline-none"
                            v-model="loginForm.password" placeholder="请输入密码" />
                    </div>
                    <div class="flex items-center justify-between">
                        <button type="submit" class="w-full px-4 py-2 bg-global text-white cursor-pointer"
                            @click.prevent="login">点击登录</button>
                    </div>
                </form>
            </div>
            <div v-else class="flex-1">
                <form class="flex h-full flex-col justify-between">
                    <div class="flex flex-col w-full h-48">
                        <label for="username" class="block text-xl font-medium text-gray-700">用户名</label>
                        <input type="text" id="username" placeholder="请输入用户名"
                            class="w-full py-3 bg-transparent border-none focus:outline-none"
                            v-model="registerForm.username" />
                        <label for="password" class="block text-xl font-medium text-gray-700">密码</label>
                        <input type="password" id="password" placeholder="请输入密码"
                            class="w-full py-3 bg-transparent border-none focus:outline-none"
                            v-model="registerForm.password" />
                        <label for="confirmPassword" class="block text-xl font-medium text-gray-700">确认密码</label>
                        <input type="password" id="confirmPassword"
                            class="w-full py-3 bg-transparent border-none focus:outline-none" placeholder="请再次输入密码"
                            v-model="registerForm.confirmPassword" />
                    </div>
                    <div class="flex items-center justify-between mt-8">
                        <button type="submit" class="w-full px-4 py-2 bg-global text-white cursor-pointer"
                            @click.prevent="register">点击注册</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
