<template>
    <div class="main-header">
        <NuxtLink class="menu-link-main" href="#">每日推荐</NuxtLink>
        <div class="header-menu">
            <NuxtLink v-for="menu in groups" :key="menu.key" :to="menu.url" :class="[
                'menu-link',
                menu.key == activeKey ? 'is-active' : '',
                menu.new ? 'notify' : '',
            ]">{{ menu.name }}</NuxtLink>

        </div>
    </div>
</template>
<script lang="ts" setup>
import { Layout } from '~/types';

const activeKey = ref<string | undefined | null>('');
const route = useRoute();

const groups = reactive<Layout.MainHeader.MenuGroups>([])
activeKey.value = route.name?.toString();

</script>