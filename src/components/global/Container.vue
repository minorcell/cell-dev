<template>
    <div class="w-screen h-screen flex">
        <Sider :isCloseable="isCloseable" />
        <div class="flex-1 h-screen border flex flex-col">
            <Header :is-sidebar-open="isCloseable" @toggle-sidebar="isCloseable = !isCloseable" />
            <div class="w-full h-[1px] border bg-gray-300" />
            <main class="flex-1"><router-view /></main>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './Header.vue';
import Sider from './Sider.vue';

const isCloseable = ref(false);
</script>
