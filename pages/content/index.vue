<template>
    <div class="content-wrapper">
        <ContentWrapper />
        <ContentSection :title="'最新歌曲'">
            <ContentSectionSongList />
        </ContentSection>
        <ContentSection :title="'热门歌单'">
            <ContentSectionPlayList />
        </ContentSection>
    </div>
</template>
<script lang="ts" setup>
import ContentWrapper from "./wrapper/index.vue"
import ContentSection from "./section/index.vue"
import ContentSectionSongList from "./section/song-list/index.vue"
import ContentSectionPlayList from "./section/play-list/index.vue"
</script>
<style scoped>
.content-button {
    text-decoration: none;
}

.click-svg {
    cursor: pointer;
}

.main-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

</style>