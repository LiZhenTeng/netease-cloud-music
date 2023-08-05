<template>
    <div class="content-wrapper">
        <HomeWrapper />
        <div class="content-section">
            <div class="content-section-title">最新歌曲</div>
            <HomeSongList />
        </div>
        <div class="content-section">
            <div class="content-section-title">热门歌单</div>
            <HomePlayList />
        </div>
    </div>
</template>
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