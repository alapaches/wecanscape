// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  devtools: { enabled: false },
  pages: true,

  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },

    "@nuxtjs/leaflet"

  ],
  components: [
    {
      global: true,
      path: "~/components",
      pathPrefix: false
    }
  ],

  plugins: [
    {
      src: "~/plugins/firebaseConfig.js"
    },
    {
      src: "~/utils/mapUtils.js"
    }
  ],
  css: [
    'vuetify/styles',
    "~/assets/css/main.css"
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})