const isDev = process.env.NODE_ENV === 'development'
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN"
      },
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
    '@element-plus/nuxt',
    '@nuxtjs/i18n',
    'nuxt-lodash'
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
  vite: {
    build: {
      rollupOptions: {
        external: ['APlayer']
      }
    }
  },
  appConfig: {
    limit: 24
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: isDev ? process.env.NETEASE_API_BASEURL : "https://netease-cloud-music-api-rose-pi.vercel.app"
    },
  },
  /* i18n: {
    detectBrowserLanguage: {
      useCookie: false,
      fallbackLocale: 'en',
    },
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        file: 'en.ts',
      },
      {
        code: 'zh-CN',
        file: 'zh-CN.ts',
      },
      {
        code: 'tr',
        file: 'tr.ts',
      },
      {
        code: 'zh-TW',
        file: 'zh-TW.ts',
      },
    ],
    lazy: true,
    langDir: 'internationalization',
    defaultLocale: 'en',
  }, */
})
