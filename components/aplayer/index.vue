<template>
    <div class="netease-aplayer"></div>
</template>
  
<script lang="ts" setup>
import APlayer from 'APlayer';
import 'aplayer/dist/APlayer.min.css';
import { storeToRefs } from 'pinia';
const aPlayer = useAPlayerStore();
const { audios } = storeToRefs(aPlayer)
const { fixed, mini, autoplay, theme, listFolded, listMaxHeight, loop, lrcType, order, preload, volume, songId, songType, storageName, mutex } = withDefaults(defineProps<{
    fixed: boolean
    mini: boolean,
    autoplay: boolean,
    theme: string,
    loop: 'all' | 'one' | 'none',
    order: 'list' | 'random',
    preload: 'auto' | 'metadata' | 'none',
    volume: number,
    songType: string,
    songId: number,
    mutex: boolean,
    lrcType: number,
    listFolded: boolean,
    listMaxHeight: string,
    storageName: string,
}>(), {
    fixed: true,
    mini: true,
    autoplay: false,
    theme: 'rgba(255,255,255,0.2)',
    loop: 'all',
    order: 'random',
    preload: 'auto',
    volume: 0.7,
    songType: 'playlist',
    songId: 19723756,
    mutex: true,
    lrcType: 3,
    listFolded: true,
    listMaxHeight: '100px',
    storageName: 'aplayer-setting'
})

const ap = ref<any>();
onMounted(() => {
    ap.value = new APlayer({
        container: document.querySelector('.netease-aplayer'),
        fixed: fixed,
        mini: mini,
        autoplay: autoplay,
        theme: theme,
        loop: loop,
        order: order,
        preload: preload,
        volume: volume,
        mutex: mutex,
        lrcType: lrcType,
        listFolded: listFolded,
        listMaxHeight: listMaxHeight,
        storageName: storageName,
        audio: [{
            name: 'secret base~君がくれたもの~',
            artist: 'Silent Siren',
            url: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.mp3',
            cover: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.jpg',
            lrc: ''
        }]
    })
})
watch(audios.value, (newValue) => {
    const newAudio = newValue.filter(x => !ap.value.list.audios.map((e:any) => e.name).includes(x.name));
    ap.value.list.add(newAudio);
})

</script>