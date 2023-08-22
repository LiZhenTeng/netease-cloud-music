<template>
    <ElRow>
        <ElCol>
            <ElImage class="song-list-img app-card" :src="picUrl"></ElImage>
        </ElCol>
    </ElRow>
    <ElRow>
        <ElCol :offset="2">
            <ElText :truncated="true" class="text">
                {{ name }}
            </ElText>
        </ElCol>
    </ElRow>
</template>
<script lang="ts" setup>
defineProps<{
    picUrl: string,
    name: string
}>();
</script>
<style scoped>
.text {
    color: white;
    font-size: 13px;
}

.song-list-img {
    width: 180px;
    height: 180px;
    border-radius: 10px;
    margin: 0 10px;
    cursor: pointer;
}
</style>