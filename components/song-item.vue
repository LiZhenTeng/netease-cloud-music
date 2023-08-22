<template>
    <ElRow style="width: 100%;" :align="'middle'">
        <ElCol :span="7">
            <ElText :truncated="true" class="text">{{ name }}</ElText>
        </ElCol>
        <ElCol :span="5">
            <ElText :truncated="true" class="text">
                <IconSolidCircle :width="8" :height="8" style="padding-left: 20px;" />{{ artist }}
            </ElText>
        </ElCol>
        <ElCol :span="3">
            <ElText :truncated="true" class="text">{{ dt }}</ElText>
        </ElCol>
        <ElCol :span="6">
            <ElText :truncated="true" class="text">{{ al }}</ElText>
        </ElCol>
        <ElCol :span="3">
            <div class="button-wrapper">
                <div class="click-svg" @click="play(id)">
                    <IconPlaySong />
                </div>
                <NuxtLink :to="{ path: 'play-mv', query: { mvId: mv } }" class="click-svg" v-if="mv != 0">
                    <IconPlayMv />
                </NuxtLink>
            </div>
        </ElCol>
    </ElRow>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const { audio, artist, name } = defineProps<{
    id: number,
    mv: number,
    name: string,
    artist: string,
    dt: string,
    al: string,
    audio: any
}>()

const aPlayer = useAPlayerStore();
const { audios } = storeToRefs(aPlayer);

const play = async (id: number) => {
    const { data } = await song_url({ id: id }) as unknown as any
    const { lrc } = await lyric({ id }) as unknown as any
    audios.value.push({
        name: name,
        cover: audio.picUrl,
        url: `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
        artist: artist,
        lrc: lrc.lyric
    })
}
</script>
<style scoped>
.text {
    color: white;
}

.click-svg {
    cursor: pointer;
}

svg {
    width: 28px;
    border-radius: 6px;
    margin-right: 16px;
    flex-shrink: 0;
}
</style>