import { ListOrder, MultiPageConfig, RequestBaseConfig, Response } from "~/interface"
const apiBaseUrl = "http://cloud-music.pl-fe.cn/"
export const personalized_newsong = (
    url: string,
    params: {
        area?: string | number
        limit?: string | number
    } & RequestBaseConfig): Promise<Response> => {
    return $fetch(url, { baseURL: `${apiBaseUrl}`, params })
}

export const top_playlist = (
    url: string,
    params: { cat?: string; order?: ListOrder, limit?: number, offset?: number } & MultiPageConfig &
        RequestBaseConfig,
): Promise<Response> => {
    return $fetch(url, { baseURL: `${apiBaseUrl}`, params })
}
export const mv_url = (url: string, params: { id?: string | number; r?: string | number } & RequestBaseConfig,
): Promise<Response> => {
    return $fetch(url, { baseURL: `${apiBaseUrl}`, params })
}