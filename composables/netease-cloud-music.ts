import { ListOrder, MultiPageConfig, RequestBaseConfig, Response } from "~/interface"
const apiBaseUrl = "https://netease-cloud-music-api-rose-pi.vercel.app"
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