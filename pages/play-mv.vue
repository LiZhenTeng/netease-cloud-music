<template>
    <PlayMv :mv-id="parseInt(mvId?.toString() || '0')" />
</template>
<script lang="ts" setup>
const route = useRoute()

const { mvId } = route.query
</script>