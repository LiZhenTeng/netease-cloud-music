<template>
    <div class="content-section">
        <ContentSectionTitle :title="title" />
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
import ContentSectionTitle from '../section/title/index.vue'
defineProps<{ title: string }>();
</script>