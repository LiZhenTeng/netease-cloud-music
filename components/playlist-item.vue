<template>
    <ElImage class="song-list-img app-card" :src="coverImgUrl"></ElImage>
    <ElText :truncated="true" class="text">
        {{ name }}
    </ElText>
</template>
<script lang="ts" setup>
defineProps<{
    coverImgUrl: string,
    name: string
}>();
</script>
<style scoped>
.text {
    color: white;
    font-size: 13px;
    font-family:fangsong;
}

.song-list-img {
    width: 180px;
    height: 180px;
    border-radius: 10px;
    margin: 0 10px;
    cursor: pointer;
}
</style>