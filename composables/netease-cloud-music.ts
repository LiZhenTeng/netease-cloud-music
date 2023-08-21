import type { ListOrder, MultiPageConfig, RequestBaseConfig, Response, SongDetail } from "~/interface"
const isDev = process.env.NODE_ENV === 'development'
const apiBaseUrl = isDev ? 'http://cloud-music.pl-fe.cn/' : 'https://netease-cloud-music-api-rose-pi.vercel.app'

export const personalized_newsong = (
    params: {
        area?: string | number
        limit?: string | number
    } & RequestBaseConfig): Promise<Response> => {
    return $fetch('/personalized/newsong', { baseURL: `${apiBaseUrl}`, params })
}

export const top_playlist = (
    params: { cat?: string; order?: ListOrder, limit?: number, offset?: number } & MultiPageConfig &
        RequestBaseConfig,
): Promise<Response> => {
    return $fetch('/top/playlist', { baseURL: `${apiBaseUrl}`, params })
}

export const mv_url = (params: { id?: string | number; r?: string | number } & RequestBaseConfig,
): Promise<Response> => {
    return $fetch('/mv/url', { baseURL: `${apiBaseUrl}`, params })
}

export const user_account = (params: RequestBaseConfig): Promise<Response> => {
    return $fetch('/user/account', { baseURL: `${apiBaseUrl}`, params })
}

export const scrobble = (params: {
    id: string | number
    sourceid: string | number
    time: string | number
} & RequestBaseConfig,) => {
    params.time = new Date().getTime();
    return $fetch('/scrobble', { baseURL: `${apiBaseUrl}`, params });
}

export const personal_fm = (params: RequestBaseConfig): Promise<Response> => {
    return $fetch("/personal_fm", { baseURL: `${apiBaseUrl}`, params })
}

export const song_url = (
    params: { id: string | number; br?: string | number } & RequestBaseConfig,
): Promise<Response> => {
    return $fetch('/song/url', { baseURL: `${apiBaseUrl}`, params })
}

export const song_detail = (
    params: { ids: string } & RequestBaseConfig,
): Promise<
    Response<{
        songs: SongDetail[]
        privileges: unknown[]
        code: number
    }>
> => {
    return $fetch('/song/detail', { baseURL: `${apiBaseUrl}`, params })
}

export const album = (
    params: { id: string | number } & RequestBaseConfig,
): Promise<Response> => {
    return $fetch('/album', { baseURL: `${apiBaseUrl}`, params })
}

export const playlist_detail = (
    params: { id: string | number; s?: string | number } & RequestBaseConfig,
): Promise<Response> => {
    return $fetch('/playlist/detail', { baseURL: `${apiBaseUrl}`, params })
}

export const artists = (
    params: { id: string | number } & RequestBaseConfig,
): Promise<Response> => {
    return $fetch('/artists', { baseURL: `${apiBaseUrl}`, params })
}

export const playmode_intelligence_list = (
    params: {
        id: string | number
        pid: string | number
        sid?: string | number
        count?: string | number
    } & RequestBaseConfig,
): Promise<Response> => {
    return $fetch('/playmode/intelligence/list', { baseURL: `${apiBaseUrl}`, params })
}

export const fm_trash = (
    params: { id: string | number; time?: string | number } & RequestBaseConfig,
): Promise<Response> => {
    return $fetch('/fm_trash', { baseURL: `${apiBaseUrl}`, params })
}
export const lyric = (
    params: { id: string | number } & RequestBaseConfig,
): Promise<Response> => {
    return $fetch('/lyric', { baseURL: `${apiBaseUrl}`, params })
}

export const playlist_track_all = (
    params: {
        id: number | string
        s?: number | string
    } & MultiPageConfig &
        RequestBaseConfig,
): Promise<Response> => {
    return $fetch('/playlist/track/all', { baseURL: `${apiBaseUrl}`, params })
}