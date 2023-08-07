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
                <div class="click-svg">
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
import { personalized_newsong } from '~/composables/netease-cloud-music';

const { result } = await personalized_newsong({}) as unknown as { code: number, category: number, result: Array<any> }
result.forEach(x => {
    x.song.duration = formatTime(x.song.duration)
})
</script>