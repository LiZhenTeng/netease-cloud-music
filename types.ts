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
      
}