<template>
    <svg t="1692634256386" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8173"
        :width="width" :height="height">
        <path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#1afa29" p-id="8174"></path>
    </svg>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{
    width: string,
    height: string
}>(), {
    width: '32',
    height: '32'
})
</script>