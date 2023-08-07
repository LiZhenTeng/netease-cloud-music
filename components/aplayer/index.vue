<template>
    <div class="player" @click="toggleLyrics">
        <div class="progress-bar" :class="{
            nyancat: settings.nyancatStyle,
            'nyancat-stop': settings.nyancatStyle && !player.playing,
        }" @click.stop>
            <!-- <vue-slider v-model="progress" :min="0" :max="player.currentTrackDuration" :step="1" :drag-on-click="true"
                :duration="0" :dot-size="12" :height="2" :tooltip-formatter="formatTrackTime" :lazy="true"
                :silent="true"></vue-slider> -->
        </div>
        <div class="controls">
            <div class="playing">
                <div class="container" @click.stop>
                    <img :src="currentTrack.al && useResizeImage(currentTrack.al.picUrl, 224)" loading="lazy"
                        @click="goToAlbum" />
                    <div class="track-info" :title="audioSource">
                        <div :class="['name', { 'has-list': hasList() }]" @click="hasList() && goToList()">
                            {{ currentTrack.name }}
                        </div>
                        <div class="artist">
                            <span v-for="(ar, index) in currentTrack.ar" :key="ar.id" @click="ar.id && goToArtist(ar.id)">
                                <span :class="{ ar: ar.id }"> {{ ar.name }} </span><span
                                    v-if="index !== currentTrack.ar.length - 1">, </span>
                            </span>
                        </div>
                    </div>
                    <div class="like-button">
                        <AplayerButton :title="player.isCurrentTrackLiked
                                ? $t('player.unlike')
                                : $t('player.like')
                            ">
                            <AplayerSvg v-show="!player.isCurrentTrackLiked" icon-class="heart"></AplayerSvg>
                            <AplayerSvg v-show="player.isCurrentTrackLiked" icon-class="heart-solid"></AplayerSvg>
                        </AplayerButton>
                    </div>
                </div>
                <div class="blank"></div>
            </div>
            <div class="middle-control-buttons">
                <div class="blank"></div>
                <div class="container" @click.stop>
                    <AplayerButton v-show="!player.isPersonalFM" :title="$t('player.previous')"
                        @click.native="playPrevTrack"><AplayerSvg icon-class="previous" /></AplayerButton>
                    <AplayerButton v-show="player.isPersonalFM" title="不喜欢" @click.native="moveToFMTrash"><AplayerSvg
                            icon-class="thumbs-down" /></AplayerButton>
                    <AplayerButton class="play" :title="$t(player.playing ? 'player.pause' : 'player.play')"
                        @click.native="playOrPause">
                        <AplayerSvg :icon-class="player.playing ? 'pause' : 'play'" /></AplayerButton>
                    <AplayerButton :title="$t('player.next')" @click.native="playNextTrack"><AplayerSvg
                            icon-class="next" /></AplayerButton>
                </div>
                <div class="blank"></div>
            </div>
            <div class="right-control-buttons">
                <div class="blank"></div>
                <div class="container" @click.stop>
                    <AplayerButton :title="$t('player.nextUp')" :class="{
                        active: $route.name === 'next',
                        disabled: player.isPersonalFM,
                    }" @click.native="goToNextTracksPage"><AplayerSvg icon-class="list" /></AplayerButton>
                    <AplayerButton :class="{
                        active: player.repeatMode !== 'off',
                        disabled: player.isPersonalFM,
                    }" :title="player.repeatMode === 'one'
        ? $t('player.repeatTrack')
        : $t('player.repeat')
    " @click.native="switchRepeatMode">
                        <AplayerSvg v-show="player.repeatMode !== 'one'" icon-class="repeat" />
                        <AplayerSvg v-show="player.repeatMode === 'one'" icon-class="repeat-1" />
                    </AplayerButton>
                    <AplayerButton :class="{ active: player.shuffle, disabled: player.isPersonalFM }"
                        :title="$t('player.shuffle')" @click.native="switchShuffle"><AplayerSvg
                            icon-class="shuffle" /></AplayerButton>
                    <AplayerButton v-if="settings.enableReversedMode"
                        :class="{ active: player.reversed, disabled: player.isPersonalFM }" :title="$t('player.reversed')"
                        @click.native="switchReversed"><AplayerSvg icon-class="sort-up" /></AplayerButton>
                    <div class="volume-control">
                        <AplayerButton :title="$t('player.mute')" @click.native="mute">
                            <AplayerSvg v-show="volume > 0.5" icon-class="volume" />
                            <AplayerSvg v-show="volume === 0" icon-class="volume-mute" />
                            <AplayerSvg v-show="volume <= 0.5 && volume !== 0" icon-class="volume-half" />
                        </AplayerButton>
                        <div class="volume-bar">
                            <!-- <vue-slider v-model="volume" :min="0" :max="1" :interval="0.01" :drag-on-click="true"
                                :duration="0" tooltip="none" :dot-size="12"></vue-slider> -->
                        </div>
                    </div>

                    <AplayerButton class="lyrics-button" title="歌词" style="margin-left: 12px"
                        @click.native="toggleLyrics"><AplayerSvg icon-class="arrow-up" /></AplayerButton>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useGoToListSource, useHasListSource } from '~/composables/player';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//import '~/assets/slider.css';
import { useResizeImage } from '~/utils/player'
//import VueSlider from 'vue-slider-component'

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();
const { toggleLyrics } = playerStore;
const { player, settings, progress } = storeToRefs(playerStore);

const currentTrack = computed(() => {
    return player.value?.currentTrack
})
const volume = computed({
    get() {
        return player.value?.volume;
    },
    set(value) {
        player.value.volume = value;
    }
})
const playing = computed(() => {
    return player.value?.playing;
})

const audioSource = computed(() => {
    return player.value?._howler?._src.includes('kuwo.cn')
        ? '音源来自酷我音乐'
        : '';
})

const playPrevTrack = () => {
    player.value?.playPrevTrack();
}
const playOrPause = () => {
    player.value?.playOrPause();
}
const playNextTrack = () => {
    if (player.value?.isPersonalFM) {
        player.value?.playNextFMTrack();
    } else {
        player.value?.playNextTrack();
    }
}
const goToNextTracksPage = () => {
    if (player.value?.isPersonalFM) return;
    route.name === 'next'
        ? router.go(-1)
        : router.push({ name: 'next' });
}
const formatTrackTime = (value: number) => {
    if (!value) return '';
    let min = ~~((value / 60) % 60);
    let sec = (~~(value % 60)).toString().padStart(2, '0');
    return `${min}:${sec}`;
}
const hasList = () => {
    return useHasListSource();
}
const goToList = () => {
    useGoToListSource();
}
const goToAlbum = () => {
    if (player.value?.currentTrack.al.id === 0) return;
    router.push({ path: '/album/' + player.value.currentTrack.al.id });
}
const goToArtist = (id: string | number) => {
    router.push({ path: '/artist/' + id });
}
const moveToFMTrash = () => {
    player.value?.moveToFMTrash();
}
const switchRepeatMode = () => {
    player.value?.switchRepeatMode();
}
const switchShuffle = () => {
    player.value?.switchShuffle();
}
const switchReversed = () => {
    player.value?.switchReversed();
}
const mute = () => {
    player.value?.mute();
}

</script>
<style lang="scss" scoped>
.player {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 64px;
    backdrop-filter: saturate(180%) blur(30px);
    // background-color: rgba(255, 255, 255, 0.86);
    background-color: var(--color-navbar-bg);
    z-index: 100;
}

@supports (-moz-appearance: none) {
    .player {
        background-color: var(--color-body-bg);
    }
}

.progress-bar {
    margin-top: -6px;
    margin-bottom: -6px;
    width: 100%;
}

.controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 100%;

    padding: {
        right: 10vw;
        left: 10vw;
    }
}

@media (max-width: 1336px) {
    .controls {
        padding: 0 5vw;
    }
}

.blank {
    flex-grow: 1;
}

.playing {
    display: flex;
}

.playing .container {
    display: flex;
    align-items: center;

    img {
        height: 46px;
        border-radius: 5px;
        box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.16);
        cursor: pointer;
        user-select: none;
    }

    .track-info {
        height: 46px;
        margin-left: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .name {
            font-weight: 600;
            font-size: 16px;
            opacity: 0.88;
            color: var(--color-text);
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            word-break: break-all;
        }

        .has-list {
            cursor: pointer;

            &:hover {
                text-decoration: underline;
            }
        }

        .artist {
            font-size: 12px;
            opacity: 0.58;
            color: var(--color-text);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            word-break: break-all;

            span.ar {
                cursor: pointer;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
}

.middle-control-buttons {
    display: flex;
}

.middle-control-buttons .container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 8px;

    .button-icon {
        margin: 0 8px;
    }

    .play {
        height: 42px;
        width: 42px;

        .svg-icon {
            width: 24px;
            height: 24px;
        }
    }
}

.right-control-buttons {
    display: flex;
}

.right-control-buttons .container {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .expand {
        margin-left: 24px;

        .svg-icon {
            height: 24px;
            width: 24px;
        }
    }

    .active .svg-icon {
        color: var(--color-primary);
    }

    .volume-control {
        margin-left: 4px;
        display: flex;
        align-items: center;

        .volume-bar {
            width: 84px;
        }
    }
}

.like-button {
    margin-left: 16px;
}

.button-icon.disabled {
    cursor: default;
    opacity: 0.38;

    &:hover {
        background: none;
    }

    &:active {
        transform: unset;
    }
}
</style>