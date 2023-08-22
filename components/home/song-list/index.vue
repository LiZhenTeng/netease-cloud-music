<template>
    <ul class="song_items">
        <li v-for="item in result" :key="item.id">
            <SongItem :id="item.id" :name="item.song.album.name"
                :artist="item.song.artists.map((x: any) => x.name).join('&')" :dt="item.song.duration" :audio="item"
                :mv="item.song.mvid" :al="item.song.alias.map((x:any)=>x).join('&')" />
        </li>
    </ul>
</template>
<script lang="ts" setup>
const { result } = await personalized_newsong({}) as unknown as { code: number, category: number, result: Array<any> }
result.forEach(x => {
    x.song.duration = formatTime(x.song.duration)
})
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

</style>