<template>
    <svg t="1691121782412" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1526"
        :width="width" :height="height">
        <path
            d="M325.504 148.992a32.256 32.256 0 0 0-8.96 22.016 28.8 28.8 0 0 0 8.96 20.992l312 320-312 320a28.8 28.8 0 0 0 0 41.984 28.8 28.8 0 0 0 20.992 8.96 30.592 30.592 0 0 0 20.992-7.936l331.008-340.992a29.952 29.952 0 0 0 8.96-22.016 29.952 29.952 0 0 0-8.96-22.016L367.488 148.992a30.592 30.592 0 0 0-20.992-8 30.592 30.592 0 0 0-20.992 8z"
            p-id="1527" fill="#ffffff"></path>
    </svg>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{
    width?: number,
    height?: number
}>(), {
    width: 20,
    height: 20
})
</script>