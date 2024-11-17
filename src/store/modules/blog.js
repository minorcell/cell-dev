import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBlogStore = defineStore('blog', () => {
    const editInfo = ref({})

    const setEditInfo = (data) => {
        console.log(data);

        editInfo.value = data
    }
    const clearEditInfo = () => {
        editInfo.value = {}
    }
    return { setEditInfo, editInfo, clearEditInfo }
}, {
    persist: true
});
