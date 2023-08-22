<template>
    <div class="content-section-title">
        <h1 class="title">
            {{ keywords || "" + " " }}
        </h1>
        搜索{{ total }}结果
    </div>
    <button  class="content-button status-button button-set">
        播放全部
    </button>
    <ElTabs v-model="activeName" @tab-change="handleChange">
        <ElTabPane label="歌曲列表" :name="NeteaseCloudMusic.SearchType.single" :lazy="true">
            <ElRow>
                <ElCol>
                    <ul class="song_items">
                        <li v-for="item in songs" :key="item.id">
                            <SongItem :id="item.id" :name="item.name" :artist="item.ar.map((x: any) => x.name).join('&')"
                                :dt="item.dt" :audio="item" :al="item.al.name" />
                        </li>
                    </ul>
                </ElCol>
            </ElRow>
        </ElTabPane>
        <ElTabPane label="歌单" :name="NeteaseCloudMusic.SearchType.playlist" :lazy="true">
            <ElRow>
                <ElCol :span="4" v-for="item in playlists" :key="item.id">
                    <NuxtLink :to="{ path: '/playlist-detail', query: { playlistId: item.id } }">
                        <PlaylistItem :coverImgUrl="item.coverImgUrl" :name="item.name" />
                    </NuxtLink>
                </ElCol>
            </ElRow>
        </ElTabPane>
        <ElTabPane label="MV" :name="NeteaseCloudMusic.SearchType.mv">
            <ElRow>
                <ElCol v-for="item in mvs" :key="item.id" :span="6">
                    <NuxtLink :to="{ path: 'play-mv', query: { mvId: item.id } }">
                        <MvItem :cover="item.cover" :name="item.name" />
                    </NuxtLink>
                </ElCol>
            </ElRow>
        </ElTabPane>
        <ElTabPane label="专辑" :name="NeteaseCloudMusic.SearchType.album">
            <ElRow>
                <ElCol v-for="item in albums" :key="item.id" :span="4">
                    <NuxtLink :to="{ path: 'album', query: { albumId: item.id } }">
                        <AlbumItem :pic-url="item.picUrl" :name="item.name" />
                    </NuxtLink>
                </ElCol>
            </ElRow>
        </ElTabPane>
    </ElTabs>
    <ElRow style="margin-top: 10px;">
        <ElCol :span="8" :offset="8">
            <ElPagination v-if="total != 0" @current-change="handleCurrentChange" class="el-pagination"
                :current-page.sync="currentPage" :page-size="limit" layout="prev, pager, next, jumper" :total="total"
                :background="true">
            </ElPagination>
        </ElCol>
    </ElRow>
</template>
<script lang="ts" setup>
const { keywords } = defineProps<{
    keywords: string
}>()
import { NeteaseCloudMusic } from "~/types"

const { limit } = useAppConfig();

const currentPage = ref(1);
const songs = reactive<Array<any>>([]);
const playlists = reactive<Array<any>>([]);
const mvs = reactive<Array<any>>([]);
const albums = reactive<Array<any>>([]);
const total = ref(0);
const activeName = ref<NeteaseCloudMusic.SearchType>(NeteaseCloudMusic.SearchType.single);

const search = async () => {
    const response = await cloudsearch({ keywords, type: activeName.value, limit, offset: (currentPage.value - 1) * limit }) as unknown as any
    if (activeName.value == NeteaseCloudMusic.SearchType.single) {
        response.result.songs.forEach((x: any) => {
            x.dt = formatTime(x.dt)
        })
        total.value = response.result.songCount;
        songs.length = 0;
        songs.push(...response.result.songs);
    } else if (activeName.value == NeteaseCloudMusic.SearchType.playlist) {
        total.value = response.result.playlistCount;
        playlists.length = 0;
        playlists.push(...response.result.playlists);
    }
    else if (activeName.value == NeteaseCloudMusic.SearchType.mv) {
        total.value = response.result.mvCount;
        mvs.length = 0;
        mvs.push(...response.result.mvs);
    }
    else if (activeName.value == NeteaseCloudMusic.SearchType.album) {
        total.value = response.result.albumCount;
        albums.length = 0;
        albums.push(...response.result.albums);
    }
}
watch(currentPage, async () => {
    await search()
}, {
    immediate: true
})
const handleCurrentChange = async (page: number) => {
    currentPage.value = page;
}
const handleChange = async () => {
    if (currentPage.value == 1) {
        await search()
    }
    currentPage.value = 1;
}

</script>
<style scoped>
.song_items {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: space-around;
    background-color: var(--content-bg);
    padding-left: 0;
    margin: 0;
    border-radius: 14px;
    border: 1px solid var(--theme-bg-color);
    /* cursor: pointer; */
}

.song_items li {
    list-style: none;
    padding: 2px 18px;
    display: flex;
    align-items: center;
    font-size: 14px;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    transition: 0.3s;
}

.song_items li:hover {
    background-color: var(--theme-bg-color);
}

.song_items li:hover:first-child {
    border-radius: 13px 13px 0 0;
}

.song_items li:hover:last-child {
    border-radius: 0 0 13px 13px;
}

.song_items li+li {
    border-top: 1px solid var(--border-color);
}

.app-img-width {
    width: 90%;
    height: 220px;
    border-radius: 10px;
    margin: 0 10px;
    cursor: pointer;
}

.song-list-text {
    text-align: center;
    font-weight: 500;
    cursor: pointer;
    font-size: 16px;
    color: white;
}
</style>