import { storeToRefs } from "pinia";
import { decode, isCreateMpris, isCreateTray } from "~/utils/player";
import { album, artists, fm_trash, personal_fm, playlist_detail, playmode_intelligence_list, scrobble, song_detail, song_url } from "./netease-cloud-music";
import { Howl, Howler } from 'howler';
import { useRouter } from "~/.nuxt/vue-router";
import { LRUCache } from "lru-cache";

const promiseCache = new LRUCache<string, any>({
    max: 500,
    ttl: 2000 * 60 * 60, // 2 hour
})
const router = useRouter();
const playerStore = usePlayerStore(pinia);
const { useIsAccountLoggedIn, title, liked, lastfm, settings, progress, player, data } = storeToRefs(playerStore);
//const playerStore = {} as any
//const { useIsAccountLoggedIn, title, liked, lastfm, settings, progress, player, data } = {} as any
const { showToast } = playerStore;
const PLAY_PAUSE_FADE_DURATION = 200;
const UNPLAYABLE_CONDITION = {
    PLAY_NEXT_TRACK: 'playNextTrack',
    PLAY_PREV_TRACK: 'playPrevTrack',
};
const electron =
    process.env.IS_ELECTRON ? window.require('electron') : null;
const ipcRenderer =
    process.env.IS_ELECTRON ? electron.ipcRenderer : null;
const excludeSaveKeys = [
    '_playing',
    '_personalFMLoading',
    '_personalFMNextLoading',
];
const delay = (ms: number | undefined) =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve(false);
        }, ms);
    });
const setTrayLikeState = (isLiked: any) => {
    if (isCreateTray) {
        ipcRenderer?.send('updateTrayLikeState', isLiked);
    }
}

const setTitle = (track: { id?: number; name?: any; ar?: any; } | null) => {
    document.title = track
        ? `${track.name} · ${track.ar[0].name} - Netease Cloud Music`
        : 'Netease Cloud Music';
    if (isCreateTray) {
        ipcRenderer?.send('updateTrayTooltip', document.title);
    }
    title.value = document.title;
}

export const useGoToListSource = () => {
    router.push({ path: useGetListSourcePath() });
}

export const useHasListSource = () => {
    return !player.value?.isPersonalFM && player.value.playlistSource.id !== 0;
}
export const useGetListSourcePath = () => {
    if (player.value.playlistSource.id === data.value?.likedSongPlaylistID) {
        return '/library/liked-songs';
    } else if (player.value?.playlistSource.type === 'url') {
        return player.value?.playlistSource.id;
    } else if (player.value?.playlistSource.type === 'cloudDisk') {
        return '/library';
    } else {
        return `/${player.value?.playlistSource.type}/${player.value?.playlistSource.id}`;
    }
}


export class Player {
    private _playing: boolean;
    private _enabled: boolean;
    public _progress: number;
    private _repeatMode: string;
    private _shuffle: boolean;
    private _reversed: boolean;
    private _volume: number;
    private _volumeBeforeMuted: number;
    private _personalFMLoading: boolean;
    private _personalFMNextLoading: boolean;
    private _list: any[];
    private _current: number;
    private _playlistSource: { type: string; id: number; };
    private _currentTrack: {
        no?: any;
        al?: any;
        ar?: any;
        name?: any;
        dt?: number;
        id: number;
    };
    private _shuffledList: any[];
    private _playNextList: any[];
    private _isPersonalFM: boolean;
    private _personalFMTrack: { id: number; };
    private _personalFMNextTrack: { id: number; } | undefined;
    private _shuffledCurrent: number;
    createdBlobRecords: any[];
    private _howler: any;

    constructor() {
        // 播放器状态
        this._playing = false; // 是否正在播放中
        this._progress = 0; // 当前播放歌曲的进度
        this._enabled = false; // 是否启用Player
        this._repeatMode = 'off'; // off | on | one
        this._shuffle = false; // true | false
        this._reversed = false;
        this._volume = 1; // 0 to 1
        this._volumeBeforeMuted = 1; // 用于保存静音前的音量
        this._personalFMLoading = false; // 是否正在私人FM中加载新的track
        this._personalFMNextLoading = false; // 是否正在缓存私人FM的下一首歌曲

        // 播放信息
        this._list = []; // 播放列表
        this._current = 0; // 当前播放歌曲在播放列表里的index
        this._shuffledList = []; // 被随机打乱的播放列表，随机播放模式下会使用此播放列表
        this._shuffledCurrent = 0; // 当前播放歌曲在随机列表里面的index
        this._playlistSource = { type: 'album', id: 123 }; // 当前播放列表的信息
        this._currentTrack = { id: 86827685 }; // 当前播放歌曲的详细信息
        this._playNextList = []; // 当这个list不为空时，会优先播放这个list的歌
        this._isPersonalFM = false; // 是否是私人FM模式
        this._personalFMTrack = { id: 0 }; // 私人FM当前歌曲
        this._personalFMNextTrack = {
            id: 0,
        }; // 私人FM下一首歌曲信息（为了快速加载下一首）

        /**
         * The blob records for cleanup.
         *
         * @private
         * @type {string[]}
         */
        this.createdBlobRecords = [];

        // howler (https://github.com/goldfire/howler.js)
        this._howler = null;
        Object.defineProperty(this, '_howler', {
            enumerable: false,
        });
        // init
        this._init().then(() => {
            Object.defineProperty(global, 'neteasecloudmusic', {
                value: { player: this },
                writable: true,
                configurable: true
            })
        });


    }

    get repeatMode() {
        return this._repeatMode;
    }
    set repeatMode(mode) {
        if (this._isPersonalFM) return;
        if (!['off', 'on', 'one'].includes(mode)) {
            console.warn("repeatMode: invalid args, must be 'on' | 'off' | 'one'");
            return;
        }
        this._repeatMode = mode;
    }
    get shuffle() {
        return this._shuffle;
    }
    set shuffle(shuffle) {
        if (this._isPersonalFM) return;
        if (shuffle !== true && shuffle !== false) {
            console.warn('shuffle: invalid args, must be Boolean');
            return;
        }
        this._shuffle = shuffle;
        if (shuffle) {
            this._shuffleTheList();
        }
    }
    get reversed() {
        return this._reversed;
    }
    set reversed(reversed) {
        if (this._isPersonalFM) return;
        if (reversed !== true && reversed !== false) {
            console.warn('reversed: invalid args, must be Boolean');
            return;
        }
        console.log('changing reversed to:', reversed);
        this._reversed = reversed;
    }
    get volume() {
        return this._volume;
    }
    set volume(volume) {
        this._volume = volume;
        this._howler?.volume(volume);
    }
    get list() {
        return this.shuffle ? this._shuffledList : this._list;
    }
    set list(list) {
        this._list = list;
    }
    get current() {
        return this.shuffle ? this._shuffledCurrent : this._current;
    }
    set current(current) {
        if (this.shuffle) {
            this._shuffledCurrent = current;
        } else {
            this._current = current;
        }
    }
    get enabled() {
        return this._enabled;
    }
    get playing() {
        return this._playing;
    }
    get currentTrack() {
        return this._currentTrack;
    }
    get currentTrackID() {
        return (this._currentTrack?.id ?? 0).toString();
    }
    get playlistSource() {
        return this._playlistSource;
    }
    get playNextList() {
        return this._playNextList;
    }
    get isPersonalFM() {
        return this._isPersonalFM;
    }
    get personalFMTrack() {
        return this._personalFMTrack;
    }
    get currentTrackDuration() {
        const trackDuration = this._currentTrack.dt || 1000;
        let duration = ~~(trackDuration / 1000);
        return duration > 1 ? duration - 1 : duration;
    }
    get progress() {
        return this._progress;
    }
    set progress(value) {
        if (this._howler) {
            this._howler.seek(value);
        }
    }
    get isCurrentTrackLiked() {
        return liked.value.songs.includes(this.currentTrack.id);
    }

    async _init() {
        this._loadSelfFromLocalStorage();
        this._howler?.volume(this.volume);
        if (this._enabled) {
            // 恢复当前播放歌曲
            this._replaceCurrentTrack(this.currentTrackID, false).then(() => {

                this._howler?.seek(promiseCache.get('playerCurrentTrackTime') ?? 0);
            }); // update audio source and init howler
            this._initMediaSession();
        }

        this._setIntervals();

        // 初始化私人FM
        if (
            this._personalFMTrack.id === 0 ||
            (this._personalFMNextTrack as { id: number }).id === 0 ||
            this._personalFMTrack.id === (this._personalFMNextTrack as { id: number }).id
        ) {
            const data = await personal_fm({}) as unknown as any
            this._personalFMTrack = data.data[0];
            this._personalFMNextTrack = data.data[1];
            return this._personalFMTrack;
        }
    }
    _setPlaying(isPlaying: boolean) {
        this._playing = isPlaying;
        if (isCreateTray) {
            ipcRenderer?.send('updateTrayPlayState', this._playing);
        }
    }
    _setIntervals() {
        // 同步播放进度
        // TODO: 如果 _progress 在别的地方被改变了，
        // 这个定时器会覆盖之前改变的值，是bug
        setInterval(() => {
            if (this._howler === null) return;
            this._progress = this._howler.seek();
            progress.value = this._progress;
            promiseCache.set('playerCurrentTrackTime', this._progress.toString());
            if (isCreateMpris) {
                ipcRenderer?.send('playerCurrentTrackTime', this._progress);
            }
        }, 1000);
    }
    _getNextTrack() {
        const next = this._reversed ? this.current - 1 : this.current + 1;

        if (this._playNextList.length > 0) {
            let trackID = this._playNextList.shift();
            return [trackID, this.current];
        }

        // 循环模式开启，则重新播放当前模式下的相对的下一首
        if (this.repeatMode === 'on') {
            if (this._reversed && this.current === 0) {
                // 倒序模式，当前歌曲是第一首，则重新播放列表最后一首
                return [this.list[this.list.length - 1], this.list.length - 1];
            } else if (this.list.length === this.current + 1) {
                // 正序模式，当前歌曲是最后一首，则重新播放第一首
                return [this.list[0], 0];
            }
        }

        // 返回 [trackID, index]
        return [this.list[next], next];
    }
    _getPrevTrack() {
        const next = this._reversed ? this.current + 1 : this.current - 1;

        // 循环模式开启，则重新播放当前模式下的相对的下一首
        if (this.repeatMode === 'on') {
            if (this._reversed && this.current === 0) {
                // 倒序模式，当前歌曲是最后一首，则重新播放列表第一首
                return [this.list[0], 0];
            } else if (this.list.length === this.current + 1) {
                // 正序模式，当前歌曲是第一首，则重新播放列表最后一首
                return [this.list[this.list.length - 1], this.list.length - 1];
            }
        }

        // 返回 [trackID, index]
        return [this.list[next], next];
    }
    async _shuffleTheList(firstTrackID = this.currentTrackID) {
        let list = this._list.filter(tid => tid !== firstTrackID);
        if (firstTrackID === 'first') list = this._list;
        this._shuffledList = useShuffle(list);
        if (firstTrackID !== 'first') this._shuffledList.unshift(firstTrackID);
    }
    async _scrobble(track: any, time: number, completed = false) {
        console.debug(
            `[debug][Player.js] scrobble track 👉 ${track.name} by ${track.ar[0].name} 👉 time:${time} completed: ${completed}`
        );
        const trackDuration = ~~(track.dt / 1000);
        time = completed ? trackDuration : ~~time;
        scrobble({
            id: track.id,
            sourceid: this.playlistSource.id,
            time,
        });
        if (
            lastfm.value.key !== undefined &&
            (time >= trackDuration / 2 || time >= 240)
        ) {
            const timestamp = ~~(new Date().getTime() / 1000) - time;
            /* trackScrobble({
                artist: track.ar[0].name,
                track: track.name,
                timestamp,
                album: track.al.name,
                trackNumber: track.no,
                duration: trackDuration,
            }); */
        }
    }
    _playAudioSource(source: string, autoplay = true) {
        Howler.unload();
        this._howler = new Howl({
            src: [source],
            html5: true,
            preload: true,
            format: ['mp3', 'flac'],
            onend: () => {
                this._nextTrackCallback();
            },
        });
        this._howler.on('loaderror', (_: any, errCode: number) => {
            // https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
            // code 3: MEDIA_ERR_DECODE
            if (errCode === 3) {
                this._playNextTrack(this._isPersonalFM);
            } else {
                const t = this.progress;
                this._replaceCurrentTrackAudio(this.currentTrack, false, false).then(
                    (replaced: any) => {
                        // 如果 replaced 为 false，代表当前的 track 已经不是这里想要替换的track
                        // 此时则不修改当前的歌曲进度
                        if (replaced) {
                            this._howler?.seek(t);
                            this.play();
                        }
                    }
                );
            }
        });
        if (autoplay) {
            this.play();
            if (this._currentTrack.name) {
                setTitle(this._currentTrack);
            }
            setTrayLikeState(liked.value.songs.includes(this.currentTrack.id));
        }
        this.setOutputDevice();
    }
    _getAudioSourceBlobURL(data: BlobPart) {
        // Create a new object URL.
        const source = URL.createObjectURL(new Blob([data]));

        // Clean up the previous object URLs since we've created a new one.
        // Revoke object URLs can release the memory taken by a Blob,
        // which occupied a large proportion of memory.
        for (const url in this.createdBlobRecords) {
            URL.revokeObjectURL(url);
        }

        // Then, we replace the createBlobRecords with new one with
        // our newly created object URL.
        this.createdBlobRecords = [source];

        return source;
    }
    /* _getAudioSourceFromCache(id: string) {
        return getTrackSource(id).then((t: { source: BlobPart; }) => {
            if (!t) return null;
            return this._getAudioSourceBlobURL(t.source);
        });
    } */
    async _getAudioSourceFromNetease(track: any) {
        if (useIsAccountLoggedIn.value) {
            const data = await song_url({ id: track.id }) as unknown as any
            if (!data.data[0]) return null;
            if (!data.data[0].url) return null;
            if (data.data[0].freeTrialInfo !== null) return null; // 跳过只能试听的歌曲
            const source = data.data[0].url.replace(/^http:/, 'https:');
            return source;

        } else {
            return new Promise(resolve => {
                resolve(`https://music.163.com/song/media/outer/url?id=${track.id}`);
            });
        }
    }
    async _getAudioSourceFromUnblockMusic(track: any) {
        console.debug(`[debug][Player.js] _getAudioSourceFromUnblockMusic`);

        if (
            !process.env.IS_ELECTRON ||
            settings.value.enableUnblockNeteaseMusic === false
        ) {
            return null;
        }

        /**
         *
         * @param {string=} searchMode
         * @returns {import("@unblockneteasemusic/rust-napi").SearchMode}
         */
        const determineSearchMode = (searchMode: any) => {
            /**
             * FastFirst = 0
             * OrderFirst = 1
             */
            switch (searchMode) {
                case 'fast-first':
                    return 0;
                case 'order-first':
                    return 1;
                default:
                    return 0;
            }
        };

        const retrieveSongInfo = await ipcRenderer.invoke(
            'unblock-music',
            settings.value.unmSource,
            track,
            {
                enableFlac: settings.value.unmEnableFlac || null,
                proxyUri: settings.value.unmProxyUri || null,
                searchMode: determineSearchMode(settings.value.unmSearchMode),
                config: {
                    'joox:cookie': settings.value.unmJooxCookie || null,
                    'qq:cookie': settings.value.unmQQCookie || null,
                    'ytdl:exe': settings.value.unmYtDlExe || null,
                },
            }
        );

        /* if (settings.value.automaticallyCacheSongs && retrieveSongInfo?.url) {
            // 对于来自 bilibili 的音源
            // retrieveSongInfo.url 是音频数据的base64编码
            // 其他音源为实际url
            const url =
                retrieveSongInfo.source === 'bilibili'
                    ? `data:application/octet-stream;base64,${retrieveSongInfo.url}`
                    : retrieveSongInfo.url;
            cacheTrackSource(track, url, 128000, `unm:${retrieveSongInfo.source}`);
        } */

        if (!retrieveSongInfo) {
            return null;
        }

        if (retrieveSongInfo.source !== 'bilibili') {
            return retrieveSongInfo.url;
        }

        const buffer = decode(retrieveSongInfo.url);
        return this._getAudioSourceBlobURL(buffer);
    }
    _getAudioSource(track: any) {
        return this._getAudioSourceFromNetease(track);
    }
    async _replaceCurrentTrack(
        id: string,
        autoplay = true,
        ifUnplayableThen = UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK
    ) {
        //clear()
        if (autoplay && this._currentTrack.name) {
            this._scrobble(this.currentTrack, this._howler?.seek());
        }
        const data = await song_detail({ ids: id }) as unknown as any
        const track = data.songs[0];
        this._currentTrack = track;
        this._updateMediaSessionMetaData(track);
        return this._replaceCurrentTrackAudio(
            track,
            autoplay,
            true,
            ifUnplayableThen
        );
    }
    /**
     * @returns 是否成功加载音频，并使用加载完成的音频替换了howler实例
     */
    _replaceCurrentTrackAudio(
        track: any,
        autoplay: boolean,
        isCacheNextTrack: boolean,
        ifUnplayableThen = UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK
    ) {
        return this._getAudioSource(track).then((source: string) => {
            if (source) {
                let replaced = false;
                if (track.id == this.currentTrackID) {
                    this._playAudioSource(source, autoplay);
                    replaced = true;
                }
                if (isCacheNextTrack) {
                    this._cacheNextTrack();
                }
                return replaced;
            } else {
                showToast(`无法播放 ${track.name}`);
                switch (ifUnplayableThen) {
                    case UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK:
                        this._playNextTrack(this.isPersonalFM);
                        break;
                    case UNPLAYABLE_CONDITION.PLAY_PREV_TRACK:
                        this.playPrevTrack();
                        break;
                    default:
                        showToast(
                            `undefined Unplayable condition: ${ifUnplayableThen}`
                        );
                        break;
                }
                return false;
            }
        });
    }
    async _cacheNextTrack() {
        let nextTrackID = this._isPersonalFM
            ? this._personalFMNextTrack?.id ?? 0
            : this._getNextTrack()[0];
        if (!nextTrackID) return;
        if (this._personalFMTrack.id == nextTrackID) return;
        const data = await song_detail(nextTrackID) as unknown as any
        let track = data.songs[0];
        this._getAudioSource(track);
    }
    _loadSelfFromLocalStorage() {
        const player = JSON.parse(promiseCache.get('player') || '{}');
        if (!player) return;
        for (const [key, value] of Object.entries(player)) {
            Object.defineProperty(this, key, {
                value: value,
                writable: true,
                configurable: true
            })
        }
    }
    _initMediaSession() {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                this.play();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                this.pause();
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                this.playPrevTrack();
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                this._playNextTrack(this.isPersonalFM);
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                this.pause();
            });
            navigator.mediaSession.setActionHandler('seekto', event => {
                this.seek(event.seekTime);
                this._updateMediaSessionPositionState();
            });
            navigator.mediaSession.setActionHandler('seekbackward', event => {
                this.seek(this.seek() - (event.seekOffset || 10));
                this._updateMediaSessionPositionState();
            });
            navigator.mediaSession.setActionHandler('seekforward', event => {
                this.seek(this.seek() + (event.seekOffset || 10));
                this._updateMediaSessionPositionState();
            });
        }
    }
    _updateMediaSessionMetaData(track: any) {
        if ('mediaSession' in navigator === false) {
            return;
        }
        let artists = track.ar.map((a: any) => a.name);
        const metadata = {
            title: track.name,
            artist: artists.join(','),
            album: track.al.name,
            artwork: [
                {
                    src: track.al.picUrl + '?param=224y224',
                    type: 'image/jpg',
                    sizes: '224x224',
                },
                {
                    src: track.al.picUrl + '?param=512y512',
                    type: 'image/jpg',
                    sizes: '512x512',
                },
            ],
            length: this.currentTrackDuration,
            trackId: this.current,
        };

        navigator.mediaSession.metadata = new window.MediaMetadata(metadata);
        if (isCreateMpris) {
            ipcRenderer?.send('metadata', metadata);
        }
    }
    _updateMediaSessionPositionState() {
        if ('mediaSession' in navigator === false) {
            return;
        }
        if ('setPositionState' in navigator.mediaSession) {
            navigator.mediaSession.setPositionState({
                duration: ~~((this.currentTrack.dt as number) / 1000),
                playbackRate: 1.0,
                position: this.seek(),
            });
        }
    }
    _nextTrackCallback() {
        this._scrobble(this._currentTrack, 0, true);
        if (!this.isPersonalFM && this.repeatMode === 'one') {
            this._replaceCurrentTrack(this.currentTrackID.toString());
        } else {
            this._playNextTrack(this.isPersonalFM);
        }
    }
    async _loadPersonalFMNextTrack() {
        if (this._personalFMNextLoading) {
            return [false, undefined];
        }
        this._personalFMNextLoading = true;
        try {
            const data = await personal_fm({}) as unknown as any
            if (!data || !data.data) {
                this._personalFMNextTrack = undefined;
            } else {
                this._personalFMNextTrack = data.data[0];
                this._cacheNextTrack(); // cache next track
            }
            this._personalFMNextLoading = false;
            return [true, this._personalFMNextTrack];
        } catch (error) {
            this._personalFMNextTrack = undefined;
            this._personalFMNextLoading = false;
            return [false, this._personalFMNextTrack];
        }
    }
    _playDiscordPresence(track: any, seekTime = 0) {
        if (
            !process.env.IS_ELECTRON ||
            settings.value.enableDiscordRichPresence === false
        ) {
            return null;
        }
        let copyTrack = { ...track };
        copyTrack.dt -= seekTime * 1000;
        ipcRenderer?.send('playDiscordPresence', copyTrack);
    }
    _pauseDiscordPresence(track: any) {
        if (
            !process.env.IS_ELECTRON ||
            settings.value.enableDiscordRichPresence === false
        ) {
            return null;
        }
        ipcRenderer?.send('pauseDiscordPresence', track);
    }
    _playNextTrack(isPersonal: boolean) {
        if (isPersonal) {
            this.playNextFMTrack();
        } else {
            this.playNextTrack();
        }
    }

    appendTrack(trackID: any) {
        this.list.push(trackID);

    }
    playNextTrack() {
        // TODO: 切换歌曲时增加加载中的状态
        const [trackID, index] = this._getNextTrack();
        if (trackID === undefined) {
            this._howler?.stop();
            this._setPlaying(false);
            return false;
        }
        this.current = index;
        this._replaceCurrentTrack(trackID);
        return true;
    }
    async playNextFMTrack() {
        if (this._personalFMLoading) {
            return false;
        }

        this._isPersonalFM = true;
        if (!this._personalFMNextTrack) {
            this._personalFMLoading = true;
            let result = null;
            let retryCount = 5;
            for (; retryCount >= 0; retryCount--) {
                result = (await personal_fm({}).catch(() => null)) as unknown as any;
                if (!result) {
                    this._personalFMLoading = false;
                    showToast('personal fm timeout');
                    return false;
                }
                if (result?.length > 0) {
                    break;
                } else if (retryCount > 0) {
                    await delay(1000);
                }
            }
            this._personalFMLoading = false;

            if (retryCount < 0) {
                let content = '获取私人FM数据时重试次数过多，请手动切换下一首';
                showToast(content);
                return false;
            }
            // 这里只能拿到一条数据
            this._personalFMTrack = result.data[0];
        } else {
            if (this._personalFMNextTrack.id === this._personalFMTrack.id) {
                return false;
            }
            this._personalFMTrack = this._personalFMNextTrack;
        }
        if (this._isPersonalFM) {
            this._replaceCurrentTrack(this._personalFMTrack.id.toString());
        }
        this._loadPersonalFMNextTrack();
        return true;
    }
    playPrevTrack() {
        const [trackID, index] = this._getPrevTrack();
        if (trackID === undefined) return false;
        this.current = index;
        this._replaceCurrentTrack(
            trackID,
            true,
            UNPLAYABLE_CONDITION.PLAY_PREV_TRACK
        );
        return true;
    }
    saveSelfToLocalStorage() {
        let player: { [x: string]: any } = {};
        for (let [key, value] of Object.entries(this)) {
            if (excludeSaveKeys.includes(key)) continue;
            player[key] = value;
        }
        promiseCache.set('player', JSON.stringify(player));
    }

    pause() {
        //stop();
        this._howler?.fade(this.volume, 0, PLAY_PAUSE_FADE_DURATION);

        this._howler?.once('fade', () => {
            this._howler?.pause();
            this._setPlaying(false);
            setTitle(null);
            this._pauseDiscordPresence(this._currentTrack);
        });
    }
    play() {
        if (this._howler?.playing()) return;
        this._howler?.play();
        this._howler?.once('play', () => {
            this._howler?.fade(0, this.volume, PLAY_PAUSE_FADE_DURATION);

            this._setPlaying(true);
            if (this._currentTrack.name) {
                setTitle(this._currentTrack);
            }
            this._playDiscordPresence(this._currentTrack, this.seek());
            //start();
        });

    }
    playOrPause() {
        if (this._howler?.playing()) {
            this.pause();
        } else {
            this.play();
        }
    }
    seek(time: number | null = null) {
        if (time !== null) {
            this._howler?.seek(time);
            if (this._playing)
                this._playDiscordPresence(this._currentTrack, this.seek());
        }
        return this._howler === null ? 0 : this._howler.seek();
    }
    mute() {
        if (this.volume === 0) {
            this.volume = this._volumeBeforeMuted;
        } else {
            this._volumeBeforeMuted = this.volume;
            this.volume = 0;
        }
    }
    setOutputDevice() {
        if (this._howler?._sounds.length <= 0 || !this._howler?._sounds[0]._node) {
            return;
        }
        this._howler?._sounds[0]._node.setSinkId(settings.value.outputDevice);
    }

    replacePlaylist(
        trackIDs: any[],
        playlistSourceID: any,
        playlistSourceType: string,
        autoPlayTrackID = 'first'
    ) {
        this._isPersonalFM = false;
        if (!this._enabled) this._enabled = true;
        this.list = trackIDs;
        this.current = 0;
        this._playlistSource = {
            type: playlistSourceType,
            id: playlistSourceID,
        };
        if (this.shuffle) this._shuffleTheList(autoPlayTrackID);
        if (autoPlayTrackID === 'first') {
            this._replaceCurrentTrack(this.list[0]);
        } else {
            this.current = trackIDs.indexOf(autoPlayTrackID);
            this._replaceCurrentTrack(autoPlayTrackID);
        }
    }
    async playAlbumByID(id: number, trackID = 'first') {
        const data = await album({ id }) as unknown as any
        let trackIDs = data.songs.map((t: any) => t.id);
        this.replacePlaylist(trackIDs, id, 'album', trackID);
    }
    async playPlaylistByID(id: number, trackID = 'first', noCache = false) {
        console.debug(
            `[debug][Player.js] playPlaylistByID 👉 id:${id} trackID:${trackID}`
        );
        const data = await playlist_detail({ id }) as unknown as any
        let trackIDs = data.playlist.trackIds.map((t: any) => t.id);
        this.replacePlaylist(trackIDs, id, 'playlist', trackID);
    }
    async playArtistByID(id: number, trackID = 'first') {
        const data = await artists({ id }) as unknown as any
        let trackIDs = data.hotSongs.map((t: any) => t.id);
        this.replacePlaylist(trackIDs, id, 'artist', trackID);
    }
    playTrackOnListByID(id: any, listName = 'default') {
        if (listName === 'default') {
            this._current = this._list.findIndex(t => t === id);
        }
        this._replaceCurrentTrack(id);
    }
    async playIntelligenceListById(id: any, trackID = 'first', noCache = false) {
        const data = await playlist_detail({ id }) as unknown as any
        const randomId = Math.floor(
            Math.random() * (data.playlist.trackIds.length + 1)
        );
        const songId = data.playlist.trackIds[randomId].id;
        const result = await playmode_intelligence_list({ id: songId, pid: id }) as unknown as any
        let trackIDs = result.data.map((t: any) => t.id);
        this.replacePlaylist(trackIDs, id, 'playlist', trackID);
    }
    addTrackToPlayNext(trackID: any, playNow = false) {
        this._playNextList.push(trackID);
        if (playNow) {
            this.playNextTrack();
        }
    }
    playPersonalFM() {
        this._isPersonalFM = true;
        if (!this._enabled) this._enabled = true;
        if (Number(this.currentTrackID) !== this._personalFMTrack.id) {
            this._replaceCurrentTrack(this._personalFMTrack.id.toString(), true);
        } else {
            this.playOrPause();
        }
    }
    async moveToFMTrash() {
        this._isPersonalFM = true;
        let id = this._personalFMTrack.id;
        if (await this.playNextFMTrack()) {
            await fm_trash({ id });
        }
    }

    sendSelfToIpcMain() {
        if (!process.env.IS_ELECTRON) return false;
        let l = liked.value.songs.includes(this.currentTrack.id);
        ipcRenderer?.send('player', {
            playing: this.playing,
            likedCurrentTrack: l,
        });
        setTrayLikeState(l);
    }

    switchRepeatMode() {
        if (this._repeatMode === 'on') {
            this.repeatMode = 'one';
        } else if (this._repeatMode === 'one') {
            this.repeatMode = 'off';
        } else {
            this.repeatMode = 'on';
        }
        if (isCreateMpris) {
            ipcRenderer?.send('switchRepeatMode', this.repeatMode);
        }
    }
    switchShuffle() {
        this.shuffle = !this.shuffle;
        if (isCreateMpris) {
            ipcRenderer?.send('switchShuffle', this.shuffle);
        }
    }
    switchReversed() {
        this.reversed = !this.reversed;
    }

    clearPlayNextList() {
        this._playNextList = [];
    }
    removeTrackFromQueue(index: number) {
        this._playNextList.splice(index, 1);
    }
}
