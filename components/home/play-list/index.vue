<template>
    <div class="apps-card">
        <ElRow>
            <ElCol :span="4" v-for="item in playlists" :key="item.id">
                <ElImage class="song-list-img app-card" :src="item.coverImgUrl"></ElImage>
                <h5 class="song-list-text" :title="item.name.length > 20 ? item.name : ''">{{
                    item.name.length > 20 ? item.name.substr(0, 18) + '...' : item.name }}</h5>
            </ElCol>
        </ElRow>
        <ElRow>
            <ElCol :span="8" :offset="12">
                <ElPagination v-if="total != 0" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                    :page-size="limit" layout="prev, pager, next, jumper" :total="total" :background="true">
                </ElPagination>
            </ElCol>
        </ElRow>
    </div>
</template>
<script lang="ts" setup>
import { top_playlist } from '~/composables/netease-cloud-music';
const { limit } = useAppConfig();
const playlists = reactive<Array<any>>([]);
const total = ref(0);
const currentPage = ref(1);

const handleCurrentChange = async (page: number) => {
    currentPage.value = page;
}
watch(currentPage, async () => {
    const response = await top_playlist({ limit: 24, offset: (currentPage.value - 1) * limit }) as unknown as {
        playlists: Array<any>, total: number, code: number,
        more: true,
        cat: string
    }
    playlists.length = 0;
    playlists.push(...response.playlists);
    total.value = response.total;
}, { immediate: true })

</script>
<style scoped>
.song-list-img {
    width: 180px;
    height: 180px;
    border-radius: 10px;
    margin: 0 10px;
    cursor: pointer;
}

.song-list-text {
    padding-left: 10px;
    font-weight: 400;
    cursor: pointer;
}
</style>