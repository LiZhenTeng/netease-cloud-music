import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
    routeRules: {
        '/**': { cors: true },
    },
    runtimeConfig: {
        neteaseCloudMusic: {
            //apiBaseUrl: 'https://netease-cloud-music-api-rose-pi.vercel.app'
            //国内$fetch请求不了海外接口
            apiBaseUrl: 'http://localhost:5168/netease-cloud-music'
        }
    }
})
