import { user_account } from "~/composables/netease-cloud-music";
import { playlistCategories, shortcuts } from "~/constants/player";
import { Player } from "~/types"
export const usePlayerStore = defineStore('player', {
    state: (): Player.State => ({
        title: 'YesPlayMusic',
        showLyrics: false,
        enableScrolling: true,
        player: {},
        progress: 0,
        settings: {
            lang: null,
            musicLanguage: 'all',
            appearance: 'auto',
            musicQuality: 320000,
            lyricFontSize: 28,
            outputDevice: 'default',
            showPlaylistsByAppleMusic: true,
            enableUnblockNeteaseMusic: true,
            automaticallyCacheSongs: true,
            cacheLimit: 8192,
            enableReversedMode: false,
            nyancatStyle: false,
            showLyricsTranslation: true,
            lyricsBackground: true,
            closeAppOption: 'ask',
            enableDiscordRichPresence: false,
            enableGlobalShortcut: true,
            showLibraryDefault: false,
            subTitleDefault: false,
            linuxEnableCustomTitlebar: false,
            enabledPlaylistCategories: playlistCategories
                .filter(c => c.enable)
                .map(c => c.name),
            proxyConfig: {
                protocol: 'noProxy',
                server: '',
                port: null,
            },
            shortcuts: shortcuts,
            showLyricsTime: false
        },
        data: {
            user: {},
            likedSongPlaylistID: 0,
            lastRefreshCookieDate: 0,
            loginMode: null,
        },
        toast: {
            show: false,
            text: '',
            timer: null,
        },
        liked: {
            songs: Array<any>(),
            songsWithDetails: [], // 只有前12首
            playlists: [],
            albums: [],
            artists: [],
            mvs: [],
            cloudDisk: [],
            playHistory: {
                weekData: [],
                allData: [],
            },
        },
        modals: {
            addTrackToPlaylistModal: {
                show: false,
                selectedTrackID: 0,
            },
            newPlaylistModal: {
                show: false,
                afterCreateAddTrackID: 0,
            },
        },
        dailyTracks: [],
        lastfm: {}
    }),
    getters: {
        useIsAccountLoggedIn: (state) => {
            return useCookie('MUSIC_U') !== undefined &&
                state.data?.value?.loginMode === 'account'
        },
        useIsUsernameLoggedIn: (state) => {
            // 用户名搜索（用户数据为只读）
            return state.data.value?.loginMode === 'username';
        },
        useIsLooseLoggedIn: (state) => {
            // 账户登录或者用户名搜索都判断为登录，宽松检查
            return (useCookie('MUSIC_U') !== undefined &&
                state.data?.value?.loginMode === 'account') || state.data.value?.loginMode === 'username';
        }
    },
    actions: {
        async user_account() {
            if (!this.useIsAccountLoggedIn) return;
            const data = await user_account({}) as unknown as any
            if (data.code === 200) {
                this.data.user = data.profile
            }
        },
        togglePlaylistCategory(name: any) {
            const index = this.settings.enabledPlaylistCategories.findIndex(
                (c: any) => c === name
            );
            if (index !== -1) {
                this.settings.enabledPlaylistCategories =
                    this.settings.enabledPlaylistCategories.filter((c: any) => c !== name);
            } else {
                this.settings.enabledPlaylistCategories.push(name);
            }
        },
        toggleLyrics() {
            this.showLyrics = !this.showLyrics;
        },
        updateDailyTracks(dailyTracks: Array<any>) {
            this.dailyTracks = dailyTracks;
        },
        updateToast(toast: { show: boolean; text: string; timer: NodeJS.Timeout | null; }) {
            this.toast = toast;
        },
        showToast(text: string) {
            if (this.toast.timer !== null) {
                clearTimeout(this.toast.timer);
                this.updateToast({ show: false, text: '', timer: null });
            }
            this.updateToast({
                show: true,
                text,
                timer: setTimeout(() => {
                    this.updateToast({
                        show: false,
                        text: this.toast.text,
                        timer: null,
                    });
                }, 3200),
            });
        },
        updateLiked({ name, data }: { name: string, data: any }) {
            this.liked[name] = data;
            if (name === 'songs') {
                this.player.sendSelfToIpcMain();
            }
        },
        updateModal({ modalName, key, value }: { modalName: string, key: string, value: boolean }) {
            this.modals[modalName][key] = value;
            if (key === 'show') {
                // 100ms的延迟是为等待右键菜单blur之后再disableScrolling
                value === true
                    ? setTimeout(() => (this.enableScrolling = false), 100)
                    : (this.enableScrolling = true);
            }
        },
        updateData({ key, value }: { key: string, value: any }) {
            this.data[key] = value;
        },
    }
})