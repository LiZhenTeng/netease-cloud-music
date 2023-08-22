export namespace Layout {
    export namespace Left {
        export type MenuGroups = Array<Group>
        type Group = {
            key: string
            title: string
            menus: Array<Menu>
        }
        type Menu = {
            name: string,
            alias: string
            key: string,
            url: string,
            icon: string
        }
    }
    export namespace MainHeader {
        export type MenuGroups = Array<Group>
        type Group = {
            name: string,
            key: string,
            url: string,
            new: boolean
        }
    }
}
export namespace APlayer {
    export type Audios = Array<Audio>
    export type Audio = {
        id: number,
        name: string,
        artist: string,
        url: string,
        cover: string,
        lrc: string,
        theme?: string
    }
}
export namespace NeteaseCloudMusic {
    export interface RequestBaseConfig {
        cookie?: string
        realIP?: string // IPv4/IPv6 filled in X-Real-IP
        proxy?: string // HTTP proxy
    }

    export interface MultiPageConfig {
        limit?: string | number
        offset?: string | number
    }

    export interface ImageUploadConfig {
        imgFile: {
            name: string
            data: string | Buffer
        }
        imgSize?: number
        imgX?: number
        imgY?: number
    }

    export interface APIBaseResponse {
        code: number
        cookie: string
        [index: string]: unknown
    }

    export interface Response<Body = APIBaseResponse> {
        status: number // The Http Response Code
        body: Body // API Response body
        cookie: string[]
    }

    export const enum SubAction {
        sub = 1,
        unsub = 0,
    }

    type SongDetail = {
        name: string
        id: number
        pst: number
        t: number
        ar: SongDetailArtist[]
        alia: string[]
        pop: number
        st: number
        rt: string | null
        fee: SongDetailFee
        v: number
        crbt: string | null
        cf: string
        al: SongDetailAlbum
        dt: number
        h: SongDetailQuality | null
        m: SongDetailQuality | null
        l: SongDetailQuality | null
        sq: SongDetailQuality | null
        hr: unknown
        a: unknown | null
        cd: string
        no: number
        rtUrl: unknown | null
        ftype: number
        rtUrls: unknown[]
        djId: number
        copyright: SongDetailCopyright
        s_id: number
        mark: number
        originCoverType: SongDetailOriginCoverType
        originSongSimpleData: unknown | null
        tagPicList: unknown | null
        resourceState: boolean
        version: number
        songJumpInfo: unknown | null
        entertainmentTags: unknown | null
        awardTags: unknown | null
        single: number
        noCopyrightRcmd: unknown | null
        mv: number
        rtype: number
        rurl: unknown | null
        mst: number
        cp: number
        publishTime: number
    }

    type SongDetailArtist = {
        id: number
        name: string
        tns: unknown[]
        alias: unknown[]
    }

    type SongDetailFee = 0 | 1 | 4 | 8

    type SongDetailAlbum = {
        id: number
        name: string
        picUrl: string
        tns: unknown[]
        pic: number
    }

    type SongDetailQuality = {
        br: number
        fid: number
        size: number
        vd: number
        sr: number
    }

    type SongDetailCopyright = 0 | 1 | 2

    type SongDetailOriginCoverType = 0 | 1 | 2
}