<template>
    <div class="main-header">
        <div class="header-menu">
            <NuxtLink class="menu-link-main" to="/">每日推荐</NuxtLink>
            <NuxtLink v-for="menu in groups" :key="menu.key" :to="menu.url" :class="[
                'menu-link',
                menu.key == activeKey ? 'is-active' : '',
                menu.new ? 'notify' : '',
            ]">{{ menu.name }}</NuxtLink>
        </div>
    </div>
</template>
<script lang="ts" setup>

const activeKey = ref<string | undefined | null>('');
const route = useRoute();
const menus = useMenusStore();
const { mainHeader: groups } = menus
activeKey.value = route.name?.toString();

</script>