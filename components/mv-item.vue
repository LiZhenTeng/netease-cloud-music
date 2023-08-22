<template>
    <ElRow>
        <ElCol>
            <ElImage class="app-card app-img-width" :src="cover"></ElImage>
        </ElCol>
    </ElRow>
    <ElRow>
        <ElCol :offset="1">
            <ElText :truncated="true" class="text">
                {{ name }}
            </ElText>
        </ElCol>
    </ElRow>
</template>
<script lang="ts" setup>
defineProps<{
    cover: string,
    name: string
}>();
</script>
<style scoped>
.text {
    color: white;
    font-size: 14px;
}

.app-img-width {
    width: 90%;
    height: 220px;
    border-radius: 10px;
    margin: 0 10px;
    cursor: pointer;
}
</style>