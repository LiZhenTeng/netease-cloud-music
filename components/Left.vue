<template>
    <div class="left-side">
        <div>
            <div class="side-wrapper" v-for="group in groups" :key="group.title">
                <div class="side-title">{{ group.title }}</div>
                <div class="side-menu">
                    <NuxtLink :to="{ path: menu.url }" v-for="menu in group.menus" :key="menu.key">
                        <component :is="menu.icon">menu.name</component>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { Layout } from '~/types';

const groups = reactive<Layout.Left.MenuGroups>([]);
</script>
<style scoped>
a {
    list-style: none;
    text-decoration: none;
}

li {
    list-style: none;
}
</style>
