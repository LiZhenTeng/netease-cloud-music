<template>
    <svg t="1691121637046" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1056"
        :width="width" :height="height">
        <path
            d="M656.512 148.992L325.504 489.984a29.312 29.312 0 0 0-8.96 21.504c0 8.32 2.944 15.808 8.96 22.464l331.008 341.056a30.592 30.592 0 0 0 20.992 7.936 28.8 28.8 0 0 0 20.992-8.96 28.8 28.8 0 0 0 8.96-20.992 28.8 28.8 0 0 0-8.96-20.992L386.496 512l312-320a28.8 28.8 0 0 0 8.96-20.992 28.8 28.8 0 0 0-8.96-20.992 28.8 28.8 0 0 0-20.992-8.96 30.592 30.592 0 0 0-20.992 7.936z"
            p-id="1057" fill="#ffffff"></path>
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