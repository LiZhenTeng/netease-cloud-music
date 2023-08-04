<template>
    <div class="content-section">
        <ContentSectionTitle :title="title" />
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
defineProps<{ title: string }>();
import ContentSectionTitle from "./title/index.vue"
</script>