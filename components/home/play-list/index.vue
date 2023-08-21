<template>
    <ElRow>
        <ElCol :span="4" v-for="item in playlists" :key="item.id">
            <NuxtLink :to="{ path: '/playlist-detail', query: { playlistId: item.id } }">
                <PlaylistItem :coverImgUrl="item.coverImgUrl" :name="item.name" />
            </NuxtLink>
        </ElCol>
    </ElRow>
    <ElRow>
        <ElCol :span="8" :offset="8">
            <ElPagination v-if="total != 0" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                :page-size="limit" layout="prev, pager, next, jumper" :total="total" :background="true">
            </ElPagination>
        </ElCol>
    </ElRow>
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
