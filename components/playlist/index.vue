<template>
    <div class="main-header">
        <span class="menu-link-main">歌单详情</span>
    </div>
    <div class="content-wrapper">
        <ElRow>
            <ElCol>
                <div class="song-detail">
                    <div class="app-song-detail song-list-wrap">
                        <div class="cover-img-size">
                            <img :src="playlist.coverImgUrl" alt=" " class="img" />
                        </div>
                        <div class="song-info">
                            <h3 class="song-list-title" v-if="playlist.name != 0">
                                {{ playlist.name }}
                            </h3>
                            <div class="author">
                                <ElAvatar :size="50">
                                    <ElImage :src="playlist.creator.avatarUrl" />
                                </ElAvatar>
                                <span>{{ playlist.creator.nickname }}</span>
                            </div>
                            <button class="content-button status-button button-set">
                                播放全部
                            </button>
                            <div class="tags">
                                <p>标签：</p>
                                <ul class="tags">
                                    <li v-for="item in playlist.tags" :key="item.id">
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                            <p class="introduction">
                                简介：{{ playlist.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </ElCol>
        </ElRow>
        <ElRow>
            <ElCol>
                <ElRow>
                    <ElCol>
                        <div class="content-section-title">
                            歌曲
                            <span style="float: right">播放：{{ playlist.playCount }}次</span>
                        </div>
                    </ElCol>
                </ElRow>
                <ElRow>
                    <ElCol>
                        <ul class="song_items">
                            <li v-for="item in songs" :key="item.id">
                                <SongItem :id="item.id" :name="item.name"
                                    :artist="item.ar.map((x: any) => x.name).join('&')" :dt="item.dt" :audio="item"
                                    :mv="item.mv" :al="item.al.name" />
                            </li>
                        </ul>
                    </ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="8" :offset="8">
                        <ElPagination v-if="total != 0" @current-change="handleCurrentChange" class="el-pagination"
                            :current-page.sync="currentPage" :page-size="limit" layout="prev, pager, next, jumper"
                            :total="total" :background="true">
                        </ElPagination>
                    </ElCol>
                </ElRow>
            </ElCol>
        </ElRow>
        <ElRow>
            <ElCol>
                <h4 class="content-section-title">歌单评论({{ commentTotal }})</h4>
            </ElCol>
        </ElRow>
        <ElRow>
            <ElCol>
                <ElRow :gutter="20">
                    <ElCol v-for="item in comments" :key="item.id" :span="7" class="app-card comment">
                        <CommentItem :avatar-url="item.user.avatarUrl" :nickname="item.user.nickname"
                            :content="item.content" :liked-count="item.likedCount" :time-str="item.timeStr"
                            :hot="item.isHot" />
                    </ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="8" :offset="8">
                        <ElPagination v-if="commentTotal != 0" @current-change="handleCurrentChangeComment"
                            class="el-pagination" :current-page.sync="currentPageComment" :page-size="limit"
                            layout="prev, pager, next, jumper" :total="commentTotal" :background="true">
                        </ElPagination>
                    </ElCol>
                </ElRow>
            </ElCol>
        </ElRow>
    </div>
</template>
<script lang="ts" setup>
const { limit } = useAppConfig();
const route = useRoute();

const currentPage = ref(1);
const currentPageComment = ref(1);
const songs = reactive<Array<any>>([]);
const total = ref(0);
const commentTotal = ref(0);
const comments = reactive<Array<any>>([]);

const { playlist } = await playlist_detail({ id: route.query.playlistId?.toString() as string }) as unknown as any;
total.value = playlist.trackIds.length;

const handleCurrentChange = async (page: number) => {
    currentPage.value = page;
}
const handleCurrentChangeComment = async (page: number) => {
    currentPageComment.value = page;
}

watch(currentPage, async () => {
    const response = await playlist_track_all({
        id: route.query.playlistId?.toString() as string,
        limit,
        offset: (currentPage.value - 1) * limit,
    }) as unknown as any;
    songs.length = 0;
    songs.push(...response.songs);
    songs.forEach(x => {
        x.dt = formatTime(x.dt)
    })
}, {
    immediate: true
})
watch(currentPageComment, async () => {
    const { comments: c, hotComments, total } = await comment_playlist({
        id: route.query.playlistId?.toString() as string,
        limit,
        offset: (currentPageComment.value - 1) * limit,
    }) as unknown as any;
    hotComments?.forEach((x: any) => {
        const cIndex = c.findIndex((e: any) => e.commentId == x.commentId);
        if (cIndex > 0) {
            c.unshift(c.splice(cIndex, 1)[0])
            c[0].isHot = true
        }
    })
    comments.length = 0;
    comments.push(...c);
    commentTotal.value = total;
}, {
    immediate: true
})
</script>
<style scoped>
.el-pagination {
    margin-top: 5px;
}

.comment {
    margin-left: 30px;
}

.song-detail {
    margin-top: 1px;
}

.app-song-detail {
    width: 100%;
    padding: 10px;
    background-color: var(--content-bg);
    border-radius: 14px;
    border: 1px solid var(--theme-bg-color);
    padding: 5px;
    font-size: 16px;
}

.cover-img-size {
    width: 250px;
    position: relative;
    display: inline;
}

.cover-img-size img {
    border-radius: 10px;
    display: block;
    width: 100%;
}

.song-list-wrap {
    display: flex;
    flex-direction: row;
}

.song-list-title {
    font-weight: 200;
    display: inline;
    margin: 5px 0;
}

.song-info {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
}

.song-info p {
    color: var(--inactive-color);
}

.author {
    display: flex;
    flex-direction: row;
    height: 50px;
    line-height: 50px;
}

.author span {
    margin-left: 15px;
}

.tags {
    display: flex;
    flex-direction: row;
}

.tags p {
    padding: 0;
    margin: 10px 0;
    font-size: 14px;
}

.tags ul {
    padding: 0;
    margin: 10px 0;
}

.tags ul li {
    margin-left: 10px;
    list-style: none;
    color: var(--inactive-color);
    font-size: 14px;
}

.img {
    border-radius: 50%;
}

.button-set {
    font-size: 14px;
    width: 100px;
    margin-top: 10px;
    padding: 10px;
}

.introduction {
    margin: 0;
    font-size: 14px;
}

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
</style>