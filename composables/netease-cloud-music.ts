import { NeteaseCloudMusic } from "~/types"
const isDev = process.env.NODE_ENV === 'development'
const apiBaseUrl = isDev ? 'http://cloud-music.pl-fe.cn/' : 'https://netease-cloud-music-api-rose-pi.vercel.app'

export const personalized_newsong = (
    params: {
        area?: string | number
        limit?: string | number
    } & NeteaseCloudMusic.RequestBaseConfig): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/personalized/newsong', { baseURL: `${apiBaseUrl}`, params })
}

export const top_playlist = (
    params: { cat?: string; order?: NeteaseCloudMusic.ListOrder, limit?: number, offset?: number } & NeteaseCloudMusic.MultiPageConfig &
        NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/top/playlist', { baseURL: `${apiBaseUrl}`, params })
}

export const mv_url = (params: { id?: string | number; r?: string | number } & NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/mv/url', { baseURL: `${apiBaseUrl}`, params })
}

export const user_account = (params: NeteaseCloudMusic.RequestBaseConfig): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/user/account', { baseURL: `${apiBaseUrl}`, params })
}

export const scrobble = (params: {
    id: string | number
    sourceid: string | number
    time: string | number
} & NeteaseCloudMusic.RequestBaseConfig,) => {
    params.time = new Date().getTime();
    return $fetch('/scrobble', { baseURL: `${apiBaseUrl}`, params });
}

export const personal_fm = (params: NeteaseCloudMusic.RequestBaseConfig): Promise<NeteaseCloudMusic.Response> => {
    return $fetch("/personal_fm", { baseURL: `${apiBaseUrl}`, params })
}

export const song_url = (
    params: { id: string | number; br?: string | number } & NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/song/url', { baseURL: `${apiBaseUrl}`, params })
}

export const song_detail = (
    params: { ids: string } & NeteaseCloudMusic.RequestBaseConfig,
): Promise<
    NeteaseCloudMusic.Response<{
        songs: NeteaseCloudMusic.SongDetail[]
        privileges: unknown[]
        code: number
    }>
> => {
    return $fetch('/song/detail', { baseURL: `${apiBaseUrl}`, params })
}

export const album = (
    params: { id: string | number } & NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/album', { baseURL: `${apiBaseUrl}`, params })
}

export const playlist_detail = (
    params: { id: string | number; s?: string | number } & NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/playlist/detail', { baseURL: `${apiBaseUrl}`, params })
}

export const artists = (
    params: { id: string | number } & NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/artists', { baseURL: `${apiBaseUrl}`, params })
}

export const playmode_intelligence_list = (
    params: {
        id: string | number
        pid: string | number
        sid?: string | number
        count?: string | number
    } & NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/playmode/intelligence/list', { baseURL: `${apiBaseUrl}`, params })
}

export const fm_trash = (
    params: { id: string | number; time?: string | number } & NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/fm_trash', { baseURL: `${apiBaseUrl}`, params })
}
export const lyric = (
    params: { id: string | number } & NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/lyric', { baseURL: `${apiBaseUrl}`, params })
}

export const playlist_track_all = (
    params: {
        id: number | string
        s?: number | string
    } & NeteaseCloudMusic.MultiPageConfig &
        NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/playlist/track/all', { baseURL: `${apiBaseUrl}`, params })
}

export const comment_playlist = (
    params: {
        id: string | number

        before?: string | number
    } & NeteaseCloudMusic.MultiPageConfig &
        NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/comment/playlist', { baseURL: `${apiBaseUrl}`, params })
}
export const cloudsearch = (
    params: {
        keywords: string
        type?: NeteaseCloudMusic.SearchType
    } & NeteaseCloudMusic.MultiPageConfig &
        NeteaseCloudMusic.RequestBaseConfig,
): Promise<NeteaseCloudMusic.Response> => {
    return $fetch('/cloudsearch', { baseURL: `${apiBaseUrl}`, params })
}