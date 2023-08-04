import IconMenu from "~/components/icon/menu.vue"
import IconRadio from "~/components/icon/radio.vue"
import IconSearch from "~/components/icon/search.vue"
import IconRecentlyPlayed from "~/components/icon/recently-played.vue"
import { Layout } from "~/types"

export const leftMenus:Layout.Left.MenuGroups = [
    {
        key: 'recommend',
        title: '推荐',
        menus: [{
            name: '发现音乐',
            alias: '',
            key: 'index',
            url: '/',
            icon: IconMenu.name
        }, {
            name: '歌曲搜索',
            alias: '',
            key: 'search-song',
            url: '/search-song?keyworks=',
            icon: IconSearch.name
        }, {
            name: '播客',
            alias: '',
            key: 'hot-dj',
            url: '/hot-dj',
            icon: IconRadio.name
        }]
    }, {
        key: 'my-music',
        title: '我的音乐',
        menus: [{
            name: '最近播放',
            alias: '',
            key: 'record-recent',
            url: '/record-recent',
            icon: IconRecentlyPlayed.name
        }, {
            name: '我的播客',
            alias: '',
            key: 'my-podcast',
            url: '/my-podcast',
            icon: IconRadio.name
        }]
    }, {
        key: 'create-playlist',
        title: '创建的歌单',
        menus: []
    }, {
        key: 'favorites-playlist',
        title: '收藏的歌单',
        menus: []
    }
]
export const mainHeaderMenus:Layout.MainHeader.MenuGroups = [
    {
        name: '个性推荐',
        key: 'music',
        url: '/music',
        new: false
    }, {
        name: '专辑',
        key: 'album-newest',
        url: '/album-newest',
        new: false
    }, {
        name: '排行榜',
        key: 'top-list',
        url: '/top-list',
        new: false
    }, {
        name: '歌手',
        key: 'singers',
        url: '/singers',
        new: false
    }, {
        name: 'MV',
        key: 'new-mv',
        url: '/new-mv',
        new: false
    }
]