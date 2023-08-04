export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@element-plus/nuxt'
  ],
  nitro: {

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
