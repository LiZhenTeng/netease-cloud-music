import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
    routeRules: {
        '/**': { cors: true },
    },
    runtimeConfig: {
        neteaseCloudMusic: {
            apiBaseUrl: 'https://netease-cloud-music-api-rose-pi.vercel.app'
            //apiBaseUrl: 'http://localhost:5168/netease-cloud-music'
        }
    }
})
