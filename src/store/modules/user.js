import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({})
    const isLogin = ref(false)

    const login = (data) => {
        userInfo.value = data
        isLogin.value = true
    }
    const logout = () => {
        userInfo.value = {}
        isLogin.value = false
    }
    const updataUserInfo = (payload) => {
        userInfo.value = {
            ...userInfo.value,
            ...payload,
        }
    }
    return { userInfo, isLogin, login, logout, updataUserInfo }
}, {
    persist: true
});
