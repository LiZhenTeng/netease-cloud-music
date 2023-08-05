export default defineNuxtConfig({
  app: {
    head: {
      title: 'Netease Cloud Music',
      meta: [
        { charset: 'utf-8' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/music.ico' }]
    }
  },
  css: ['@/assets/main.css'],
  modules: [
    '@pinia/nuxt',
    '@element-plus/nuxt'
  ],
  nitro: {
    routeRules: {
      '/**': { isr: false },
    },
  },
  imports: {
    dirs: ['./stores'],
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  appConfig: {
    limit: 24
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://netease-cloud-music-api-rose-pi.vercel.app'
    },
  }
})
