<template>
    <div class="header">
        <div class="header-menu">
            <h2 class="logo">
                <NuxtLink to="/">网易云音乐</NuxtLink>
            </h2>
        </div>
        <div class="top-wrap">
            <ul>
                <li></li>
                <li @click="back">
                    <IconArrowLeft />
                </li>
                <li @click="forward" style="width: 18px;">
                    <IconArrowRight />
                </li>
                <li @click="refresh">
                    <IconRefresh />
                </li>
            </ul>
        </div>
        <div class="search-bar">
            <input type="text" placeholder="搜索" @keyup.enter="search" v-model="searchValue" />
        </div>
        <div class="header-profile">
            <div style="cursor: pointer">
                <IconMessage :num="1" />
            </div>
            <NuxtLink to="/">
                <div style="margin-left: 22px; cursor: pointer">
                    <IconCloud />
                </div>
            </NuxtLink>
            <div>
                <span>
                    <img src="../assets/avatar.jpg" alt="" class="profile-img" />
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const router = useRouter();
const searchValue = ref('');
const forward = () => {
    router.go(1);
}
const refresh = () => {
    router.go(0);
}
const back = () => {
    router.back();
}
const search = () => {
    router.push({
        path: "/search-song",
        query: { keyworks: searchValue.value },
    })
}

const logout = () => {

}
</script>
<style scoped>
.el-dropdown-menu {
    background-color: var(--theme-bg-color);
    border: 0px;
}

.el-dropdown-link {
    padding-right: 10px;
}

.el-dropdown-item a {
    text-decoration: none;
    list-style: none;
    color: #606266;
}

.header-menu a {
    text-decoration: none;
    list-style: none;
    color: white;
    cursor: pointer;
}

.logo {
    background: url(../assets/topbar.png) no-repeat 0 9999px;
}

.top-wrap {
    margin-right: 300px;
}

.top-wrap ul {
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 5px;
}

.top-wrap ul li {
    list-style: none;
    margin: 0 10px;
    cursor: pointer;
    width: 16px;
    height: 16px;
}
</style>