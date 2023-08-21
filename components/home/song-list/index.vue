<template>
    <ul class="search_ul">
        <li class="adobe-product" v-for="item in result" :key="item.id">
            <div class="products" :title="item.song.album.name.length > 21 ? item.song.album.name : ''">{{
                item.song.album.name.length > 21 ? item.song.album.name.substr(0, 18) + '...' : item.song.album.name }}
            </div>
            <span class="status">
                <span class="status-circle green"></span>
                {{ item.song.artists[0].name }}</span>
            <!-- 歌曲时间 -->
            <span class="status">{{ item.song.duration }}</span>
            <!-- <span class="status">{{ item.song.alias[0] }}</span> -->
            <div class="button-wrapper">
                <div class="click-svg" @click="play(item.id)">
                    <IconPlaySong />
                </div>
                <div class="click-svg" v-if="item.song.mvid != 0">
                    <NuxtLink :to="{ path: 'play-mv', query: { mvId: item.song.mvid } }">
                        <IconPlayMv />
                    </NuxtLink>
                </div>
                <!-- <div class="click-svg">
                    {{ item.url }}
                    <a :href="item.url" target="_blank">
                        <IconDownload />
                    </a>
                </div> -->
            </div>
        </li>

    </ul>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
const aPlayer = useAPlayerStore();
const { audios } = storeToRefs(aPlayer);

const { result } = await personalized_newsong({}) as unknown as { code: number, category: number, result: Array<any> }
result.forEach(x => {
    x.song.duration = formatTime(x.song.duration)
})
const play = async (id: number) => {
    const audio = result.find(x => x.id == id);
    const { data } = await song_url({ id: id }) as unknown as any
    const { lrc } = await lyric({ id }) as unknown as any
    console.log(lrc)
    console.log(lrc);
    audios.value.push({
        name: audio.name,
        cover: audio.picUrl,
        url: `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
        artist: audio.song.artists.map((x: any) => x.name).join('&'),
        lrc: lrc.lyric
    })
}
</script>